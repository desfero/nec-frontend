import { expect } from "chai";

import { hashBlacklistedQueryParams, isLevelAllowed } from "./utils";

describe("isLevelAllowed", () => {
  it("should return correct boolean", () => {
    process.env.NF_LOG_LEVEL = "verbose";

    // level with higher priority
    expect(isLevelAllowed("fatal")).to.be.true;

    // the same priority
    expect(isLevelAllowed("verbose")).to.be.true;

    // level with lower priority
    expect(isLevelAllowed("info")).to.be.false;
  });

  it("should return correct value when flag was not defined", () => {
    delete process.env.NF_LOG_LEVEL;

    expect(isLevelAllowed("fatal")).to.be.true;
    expect(isLevelAllowed("info")).to.be.true;
  });
});

describe("hashBlacklistedQueryParams", () => {
  it("should correctly hash blacklisted query params", () => {
    const result = hashBlacklistedQueryParams(
      ["salt"],
      "https://bit.ly/verify?salt=aeb8797c-2083-4a96&bar=foo",
    );

    expect(result).to.be.equal("https://bit.ly/verify?salt=******&bar=foo");
  });

  it("should correctly hash blacklisted nested query params", () => {
    const result = hashBlacklistedQueryParams(
      ["salt"],
      "https://bit.ly/verify?redirect=%2Femail-verify%3Ffoo%3Dbar%26salt%3Daeb8797c-2083-4a96%26wallet_type%3Dbrowser",
    );

    expect(result).to.be.equal(
      "https://bit.ly/verify?redirect=%2Femail-verify%3Ffoo%3Dbar%26salt%3D******%26wallet_type%3Dbrowser",
    );
  });
});
