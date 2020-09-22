const simpleFn = require('./definition/simple.js');

module.exports = app => {
  const definitions = {
    simple: simpleFn(app),
  };
  return definitions;
};
