const documentPublish = require('./flowDef/documentPublish.js');

module.exports = app => {
  const flowDefs = [documentPublish(app)];
  return flowDefs;
};
