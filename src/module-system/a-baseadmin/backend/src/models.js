const authProvider = require('./model/authProvider.js');
const _function = require('./model/function.js');
const functionScene = require('./model/functionScene.js');

module.exports = app => {
  const models = {
    authProvider,
    function: _function,
    functionScene,
  };
  return models;
};
