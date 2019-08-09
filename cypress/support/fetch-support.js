/*
 * Cypress doesn't support `fetch` so we need to replace it by XHR during e2e tests.
 * Remove after https://github.com/cypress-io/cypress/issues/95 is done.
 */
let polyfill;

before(() => {
  const polyfillUrl = "https://unpkg.com/whatwg-fetch@3.0.0/dist/fetch.umd.js";
  cy.request(polyfillUrl).then(response => {
    polyfill = response.body;
  });
});

Cypress.on("window:before:load", win => {
  delete win.fetch;
  win.eval(polyfill);
});
