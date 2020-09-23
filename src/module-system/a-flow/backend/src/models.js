const flowDefinition = require('./model/flowDefinition.js');
const flowDefinitionContent = require('./model/flowDefinitionContent.js');
const flowDefinitionFull = require('./model/flowDefinitionFull.js');

module.exports = app => {
  const models = {
    flowDefinition,
    flowDefinitionContent,
    flowDefinitionFull,
  };
  return models;
};
