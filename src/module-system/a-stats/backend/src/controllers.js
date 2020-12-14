const sequence = require('./controller/sequence.js');

module.exports = app => {
  const controllers = {
    sequence,
  };
  return controllers;
};
