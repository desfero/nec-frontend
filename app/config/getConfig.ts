import { getRequiredEnv } from "./configUtils";

export interface IConfig {
  ethereumNetwork: {
    rpcUrl: string;
  };
}

export function getConfig(env: NodeJS.ProcessEnv): IConfig {
  return {
    ethereumNetwork: {
      rpcUrl: getRequiredEnv(env, "NF_RPC_PROVIDER"),
    },
  };
}
