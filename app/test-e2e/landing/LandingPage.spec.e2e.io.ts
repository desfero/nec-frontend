import { assertUserInLanding } from "../utils/assertions";

describe("Landing", () => {
  it("should should landing page", () => {
    cy.visit("/");

    assertUserInLanding();
  });
});
