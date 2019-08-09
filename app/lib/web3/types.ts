import { EthereumAddress } from "../../types";

export interface IEthereumNetworkConfig {
  rpcUrl: string;
}

export enum ETransferDirection {
  INCOMING = "incoming",
  OUTCOMING = "outcoming",
}

export type THistory = {
  direction: ETransferDirection;
  from: EthereumAddress;
  to: EthereumAddress;
  amount: string;
  at: number;
};
