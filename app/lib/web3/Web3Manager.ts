import { EventEmitter } from "events";
import { decorate, inject, injectable } from "inversify";
import moment, { Moment } from "moment";
import Web3 from "web3";

import { symbols } from "../../di/symbols";
import { EthereumAddressWithChecksum } from "../../types";
import { ILogger } from "../dependencies/logger/index";
import { address as necAddress, api as necABI } from "./nectarTokenContract";
import { ETransferDirection, IEthereumNetworkConfig, THistory } from "./types";

// Highest recorded value of blocks per day
const BLOCKS_MINED_PER_DAY = 6912;

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

  public async getBlock(blockNumber: number): Promise<any> {
    // TODO: Add caching as we can call `getBlock` more than once with the same block number
    //       in case a couple of transaction were mined in the same block
    return this.web3!.eth.getBlock(blockNumber);
  }

  public async getBlockTimestamp(blockNumber: number): Promise<any> {
    const block = await this.web3!.eth.getBlock(blockNumber);

    // convert from ethereum timestamp format
    return +block.timestamp * 1000;
  }

  public async getNECCurrentBalance(address: EthereumAddressWithChecksum): Promise<string> {
    const contract = new this.web3!.eth.Contract(necABI, necAddress);

    return await contract.methods.balanceOf(address).call();
  }

  public async getNECHistory(
    address: EthereumAddressWithChecksum,
    fromMoment: Moment,
  ): Promise<THistory[]> {
    const contract = new this.web3!.eth.Contract(necABI, necAddress);

    const currentBlockNumber = await this.web3!.eth.getBlockNumber();

    const fromLastDays = moment().diff(fromMoment, "days");

    // Not an ideal solution as we either download a couple of blocks more or
    // if `BLOCKS_MINED_PER_DAY` is not up to date we can miss a couple of blocks
    const fromBlockNumber = currentBlockNumber - BLOCKS_MINED_PER_DAY * fromLastDays;

    const fromBlock = await this.web3!.eth.getBlock(fromBlockNumber);

    if (fromMoment.isBefore(+fromBlock.timestamp * 1000)) {
      this.logger.warn(
        "Calculated block number is after expected moment. BLOCKS_MINED_PER_DAY constant needs adjustment",
        new Error("Invalid block number calculated"),
      );

      // TODO: Repeat loop `fromBlockNumber - BLOCKS_MINED_PER_DAY` until we get expected block number
    }

    const [incomingTransfers, outcomingTransfers] = await Promise.all([
      contract.getPastEvents("Transfer", {
        filter: { _to: [address] },
        fromBlock: fromBlockNumber,
        toBlock: "latest",
      }),
      contract.getPastEvents("Transfer", {
        filter: { _from: [address] },
        fromBlock: fromBlockNumber,
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

    return transfersWithTimestamp
      .filter(transfer => fromMoment.isBefore(transfer.timestamp))
      .map(t => ({
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
