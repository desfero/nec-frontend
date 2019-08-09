import { expect } from "chai";

import { extractNumber, isExternalUrl } from "./StringUtils";

describe("StringUtils", () => {
  describe("extractNumber", () => {
    it("extracts only numerical values from a string", () => {
      expect(extractNumber("123asdf .23")).to.eq("123.23");
    });
  });

  describe("isExternalUrl", () => {
    it("should return true for external https url", () => {
      expect(isExternalUrl("https://neufund.org")).to.be.true;
    });

    it("should return true for external http url", () => {
      expect(isExternalUrl("http://neufund.org")).to.be.true;
    });

    it("should return false for local url", () => {
      expect(isExternalUrl("/register")).to.be.false;
    });
  });
});
