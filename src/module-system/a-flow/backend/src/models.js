const flowDefinition = require('./model/flowDefinition.js');
const flowDefinitionContent = require('./model/flowDefinitionContent.js');
const flowDefinitionFull = require('./model/flowDefinitionFull.js');
const flow = require('./model/flow.js');
const flowHistory = require('./model/flowHistory.js');
const flowNode = require('./model/flowNode.js');
const flowNodeHistory = require('./model/flowNodeHistory.js');

module.exports = app => {
  const models = {
    flowDefinition,
    flowDefinitionContent,
    flowDefinitionFull,
    flow,
    flowHistory,
    flowNode,
    flowNodeHistory,
  };
  return models;
};
