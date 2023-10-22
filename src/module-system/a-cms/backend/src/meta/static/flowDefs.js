const articlePublish = require('./flowDef/articlePublish.js');

module.exports = app => {
  const flowDefs = [articlePublish(app)];
  return flowDefs;
};
