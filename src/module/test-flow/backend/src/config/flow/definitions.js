const set00_simple = require('./definition/set00_simple.js');
const set00_activityNone = require('./definition/set00_activityNone.js');
const set00_edgeSequence = require('./definition/set00_edgeSequence.js');

module.exports = app => {
  const definitions = {
    set00_simple: set00_simple(app),
    set00_activityNone: set00_activityNone(app),
    set00_edgeSequence: set00_edgeSequence(app),
  };
  return definitions;
};
