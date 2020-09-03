const version = require('./controller/version.js');
const sequence = require('./controller/sequence.js');

module.exports = app => {
  const controllers = {
    version,
    sequence,
  };
  return controllers;
};
