import { expect } from "chai";
import * as Yup from "yup";

import { findMax, findMin, getFieldSchema, isRequired } from "./yupUtils";

describe("yupUtils", () => {
  describe("isRequired", () => {
    it("should return true for required field", () => {
      const schema = Yup.object().shape({
        id: Yup.string().required(),
      });

      const idField = getFieldSchema("id", schema);

      expect(isRequired(idField)).to.be.true;
    });

    it("should return false for optional field", () => {
      const schema = Yup.object().shape({
        name: Yup.string(),
      });

      const nameField = getFieldSchema("name", schema);

      expect(isRequired(nameField)).to.be.false;
    });
  });

  describe("findMin", () => {
    it("finds yup.max() value", () => {
      const min = 1;
      const schema = Yup.number().min(min);

      expect(findMin(schema)).to.be.equal(min);
    });
  });

  describe("findMax", () => {
    it("finds yup.min() value", () => {
      const max = 20;
      const schema = Yup.number().max(max);

      expect(findMax(schema)).to.be.equal(max);
    });
  });
});
