const postPublish = require('./flowDef/postPublish.js');

module.exports = app => {
  const flowDefs = [postPublish(app)];
  return flowDefs;
};
