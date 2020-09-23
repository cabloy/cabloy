const set00_simple = require('./definition/set00_simple.js');

module.exports = app => {
  const definitions = {
    set00_simple: set00_simple(app),
  };
  return definitions;
};
