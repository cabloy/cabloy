const flowDefinition = require('./model/flowDefinition.js');

module.exports = app => {
  const models = {
    flowDefinition,
  };
  return models;
};
