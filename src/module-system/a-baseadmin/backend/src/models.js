const authProvider = require('./model/authProvider.js');
const functionScene = require('./model/functionScene.js');

module.exports = app => {
  const models = {
    authProvider,
    functionScene,
  };
  return models;
};
