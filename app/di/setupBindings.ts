import * as cryptoRandomString from "crypto-random-string";
import { Container } from "inversify";

import { IConfig } from "../config/getConfig";
import { ILogger, Logger } from "../lib/dependencies/logger";
import { NotificationCenter } from "../lib/dependencies/NotificationCenter";
import { IntlWrapper } from "../lib/intl/IntlWrapper";
import { IEthereumNetworkConfig } from "../lib/web3/types";
import { Web3Manager } from "../lib/web3/Web3Manager";
import { symbols } from "./symbols";

export function setupBindings(config: IConfig): Container {
  const container = new Container();

  // functions
  container
    .bind<typeof cryptoRandomString>(symbols.cryptoRandomString)
    .toConstantValue(cryptoRandomString);

  // configs
  container
    .bind<IEthereumNetworkConfig>(symbols.ethereumNetworkConfig)
    .toConstantValue(config.ethereumNetwork);
  container.bind<IConfig>(symbols.config).toConstantValue(config);

  container
    .bind<ILogger>(symbols.logger)
    .to(Logger)
    .inSingletonScope();

  container
    .bind<NotificationCenter>(symbols.notificationCenter)
    .to(NotificationCenter)
    .inSingletonScope();

  container
    .bind<Web3Manager>(symbols.web3Manager)
    .to(Web3Manager)
    .inSingletonScope();

  container.bind(symbols.intlWrapper).toConstantValue(new IntlWrapper());

  return container;
}

/**
 * We use plain object for injecting deps into sagas
 */
export const createGlobalDependencies = (container: Container) => ({
  // misc
  logger: container.get<ILogger>(symbols.logger),
  notificationCenter: container.get<NotificationCenter>(symbols.notificationCenter),

  cryptoRandomString: container.get<typeof cryptoRandomString>(symbols.cryptoRandomString),

  // blockchain & wallets
  web3Manager: container.get<Web3Manager>(symbols.web3Manager),

  intlWrapper: container.get<IntlWrapper>(symbols.intlWrapper),
});

export type TGlobalDependencies = ReturnType<typeof createGlobalDependencies>;
