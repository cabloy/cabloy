const mailScene = require('./schema/mailScene.js');

module.exports = app => {
  const schemas = {};
  Object.assign(schemas, mailScene(app));
  return schemas;
};
