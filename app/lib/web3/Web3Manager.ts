import { EventEmitter } from "events";
import { decorate, inject, injectable } from "inversify";
import Web3 from "web3";

import { symbols } from "../../di/symbols";
import { EthereumAddress } from "../../types";
import { ILogger } from "../dependencies/logger/index";
import { address as necAddress, api as necABI } from "./nectarTokenContract";
import { ETransferDirection, IEthereumNetworkConfig, THistory } from "./types";

try {
  // this throws if applied multiple times, which happens in tests
  // that is why the try block is necessary
  decorate(injectable(), EventEmitter);
  // this decorate is necessary for injectable class inheritance
} catch {}

// singleton holding all web3 instances
@injectable()
export class Web3Manager extends EventEmitter {
  private web3: Web3 | undefined;

  constructor(
    @inject(symbols.ethereumNetworkConfig)
    public readonly ethereumNetworkConfig: IEthereumNetworkConfig,
    @inject(symbols.logger) public readonly logger: ILogger,
  ) {
    super();
  }

  public async initialize(): Promise<void> {
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.ethereumNetworkConfig.rpcUrl));
  }

  public async getBlockTimestamp(blockNumber: number): Promise<any> {
    const block = await this.web3!.eth.getBlock(blockNumber);

    // convert from ethereum timestamp format
    return +block.timestamp * 1000;
  }

  public async getNECCurrentBalance(address: EthereumAddress): Promise<string> {
    const contract = new this.web3!.eth.Contract(necABI, necAddress);

    return await contract.methods.balanceOf(address).call();
  }

  public async getNECHistory(address: EthereumAddress): Promise<THistory[]> {
    const contract = new this.web3!.eth.Contract(necABI, necAddress);

    const [incomingTransfers, outcomingTransfers] = await Promise.all([
      contract.getPastEvents("Transfer", {
        filter: { _to: [address] },
        fromBlock: 8700473,
        toBlock: "latest",
      }),
      contract.getPastEvents("Transfer", {
        filter: { _from: [address] },
        fromBlock: 8700473,
        toBlock: "latest",
      }),
    ]);

    const transfers = [...incomingTransfers, ...outcomingTransfers];

    const transfersWithTimestamp = await Promise.all(
      transfers.map(async t => {
        const timestamp = await this.getBlockTimestamp(t.blockNumber);

        return {
          ...t,
          timestamp,
        };
      }),
    );

    return transfersWithTimestamp.map(t => ({
      direction:
        t.returnValues["_to"] === address
          ? ETransferDirection.INCOMING
          : ETransferDirection.OUTCOMING,
      amount: t.returnValues["_amount"],
      to: t.returnValues["_to"],
      from: t.returnValues["_from"],
      at: t.timestamp,
    }));
  }
}
