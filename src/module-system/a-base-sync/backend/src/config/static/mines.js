const mineAtomDrafts = require('./mines/mineAtomDrafts.js');

module.exports = app => {
  const resources = [
    mineAtomDrafts(app),
  ];
  return resources;
};
