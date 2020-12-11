const mineAtomDrafts = require('./mines/mineAtomDrafts.js');
const mineAtomStars = require('./mines/mineAtomStars.js');
const mineAtomArchives = require('./mines/mineAtomArchives.js');

module.exports = app => {
  const resources = [
    mineAtomDrafts(app),
    mineAtomStars(app),
    mineAtomArchives(app),
  ];
  return resources;
};
