const { join } = require("path");
const { mapValues } = require("lodash");
const dotenv = require("dotenv");
const fs = require("fs");

module.exports = function loadAppEnv(processEnv) {
  const universeAddressExists = !!process.env.NF_UNIVERSE_CONTRACT_ADDRESS;
  const envs = dotenv.load({ path: join(__dirname, "../.env") }).parsed;

  // we are combining the NODE_ENV variable with the local variables from the .env file
  // we can't simply pass all envs from process.env because they would become part of the bundle
  const bundle = {
    NODE_ENV: process.env.NODE_ENV || "development",
  };
  if (process.env.NF_ENABLE_TRANSLATE_OVERLAY) {
    bundle.NF_ENABLE_TRANSLATE_OVERLAY = process.env.NF_ENABLE_TRANSLATE_OVERLAY;
  }
  if (!process.env.NF_CONTRACT_ARTIFACTS_VERSION) {
    bundle.NF_CONTRACT_ARTIFACTS_VERSION = "localhost";
  }

  const allEnvs = Object.assign({}, bundle, envs);

  // extract universe address from contract artifacts repo meta.json
  // overrides .env value, if meta.json exists, but not process.env
  if (!universeAddressExists) {
    try {
      const meta = require(`../git_modules/platform-contracts-artifacts/${
        allEnvs.NF_CONTRACT_ARTIFACTS_VERSION
      }/meta.json`);
      allEnvs.NF_UNIVERSE_CONTRACT_ADDRESS = meta.UNIVERSE_ADDRESS;
    } catch (e) {
      console.error("cannot read universe address from meta.json in contract artifacts", e.message);
      console.error("not overriding NF_UNIVERSE_CONTRACT_ADDRESS");
    }
  }
  // if we want to serve local dev build on the network
  // we need to inject our local ip in the NF_RPC_PROVIDER
  if (!!process.env.NF_SERVE_ON_NETWORK) {
    const rpcProviderUrl = new URL(process.env.NF_RPC_PROVIDER);
    rpcProviderUrl.hostname = process.env.NF_SERVE_ON_NETWORK;
    allEnvs.NF_RPC_PROVIDER = rpcProviderUrl.toString();
  }
  return mapValues(allEnvs, JSON.stringify);
};
