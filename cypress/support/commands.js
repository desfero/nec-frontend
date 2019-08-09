// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { tid } from "../../test/testUtils";

Cypress.Commands.add("awaitedClick", { prevSubject: "element" }, (subject, waitDuration = 500) =>
  cy
    .get(subject.selector)
    .wait(waitDuration)
    .click(),
);

let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

const resolveMediaType = headerContents => {
  const header = new Uint8Array(headerContents)
    .subarray(0, 4)
    .reduce((acc, item) => acc + item.toString(16), "");

  switch (header) {
    case "89504e47":
      return "image/png";
    case "47494638":
      return "image/gif";
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
    case "ffd8ffe3":
    case "ffd8ffe8":
      return "image/jpeg";
    case "25504446":
      return "application/pdf";
    case "504b0304":
      return "application/zip";
  }

  return "application/octet-stream";
};

const configureBlob = (blob, name) => {
  return new Cypress.Promise((resolve, reject) =>
    Object.assign(new FileReader(), {
      onloadend: progress =>
        resolve(
          Object.assign(blob.slice(0, blob.size, resolveMediaType(progress.target.result)), {
            name,
          }),
        ),
      onerror: () => reject(null),
    }).readAsArrayBuffer(blob.slice(0, 4)),
  );
};

const createCustomEvent = (eventName, data, files) => {
  const event = new CustomEvent(eventName, {
    bubbles: true,
    cancelable: true,
  });

  const dataTransfer = Object.assign(new DataTransfer(), {
    dropEffect: "move",
  });

  (files || []).forEach(file => dataTransfer.items.add(file));

  Object.entries(data || {}).forEach(entry => dataTransfer.setData(...entry));

  return Object.assign(event, { dataTransfer });
};

Cypress.Commands.add("dropFile", { prevSubject: "element" }, (subject, file) => {
  cy.log(`Drop ${file}`);

  return cy
    .fixture(file, "base64")
    .then(Cypress.Blob.base64StringToBlob)
    .then(blob => configureBlob(blob, file))
    .then(blob => new File([blob], file, { type: blob.type }))
    .then(file => createCustomEvent("drop", {}, [file]))
    .then(event => subject[0].dispatchEvent(event));
});

// based on https://github.com/cypress-io/cypress/issues/136#issuecomment-342391119
Cypress.Commands.add("iframe", selector => {
  return cy.get(selector).then($iframe => {
    return new Cypress.Promise(resolve => {
      const observer = new MutationObserver(() => {
        setTimeout(() => {
          if (
            !$iframe
              .contents()
              .find(tid("loading-indicator-pulse"))
              .get(0)
          ) {
            resolve($iframe.contents().find("body"));
          }
        }, 1000);
      });

      $iframe.on("load", ({ currentTarget }) => {
        currentTarget.contentWindow.open = cy.stub().as("windowOpen");
        observer.observe(
          $iframe
            .contents()
            .find("body")
            .get(0),
          {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true,
          },
        );
      });
    });
  });
});
