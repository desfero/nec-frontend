import { appRoutes } from "../../components/appRoutes";
import { tid } from "./selectors";

export const assertUserInLanding = () => {
  cy.url().should("contain", appRoutes.root);

  cy.title().should("eq", "Transactions");

  cy.get(tid("landing-page")).should("exist");
};
