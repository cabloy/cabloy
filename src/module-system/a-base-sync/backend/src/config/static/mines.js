const mineAtomDrafts = require('./mines/mineAtomDrafts.js');
const mineAtomStars = require('./mines/mineAtomStars.js');
const mineAtomArchives = require('./mines/mineAtomArchives.js');
const mineTaskClaimings = require('./mines/mineTaskClaimings.js');
const mineTaskHandlings = require('./mines/mineTaskHandlings.js');
const mineTaskCompleteds = require('./mines/mineTaskCompleteds.js');

module.exports = app => {
  const resources = [
    mineAtomDrafts(app),
    mineAtomStars(app),
    mineAtomArchives(app),
    mineTaskClaimings(app),
    mineTaskHandlings(app),
    mineTaskCompleteds(app),
  ];
  return resources;
};
