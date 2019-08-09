const path = require("path");

module.exports = {
  app: path.join(__dirname, "../app"),
  dist: path.join(__dirname, "../dist"),
  appHtml: path.join(__dirname, "../app/index.html"),
  root: path.join(__dirname, ".."),
  favicon: path.join(__dirname, "../app/assets/favicon_neufund.ico"),
};
