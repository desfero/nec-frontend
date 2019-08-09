import { mapValues } from "lodash";

export const symbols = makeDebugSymbols({
  // configs
  config: Symbol(),
  ethereumNetworkConfig: Symbol(),

  // wallets
  web3Manager: Symbol(),

  // utils
  notificationCenter: Symbol(),
  logger: Symbol(),

  intlWrapper: Symbol(),

  // external modules
  cryptoRandomString: Symbol(),
});

/**
 * Adds automatically symbols name values which makes debugging easier
 */
export function makeDebugSymbols<T>(symbols: T): T {
  return mapValues(symbols as any, (_val, key) => Symbol.for(key)) as any;
}
