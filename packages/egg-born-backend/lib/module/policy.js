const path = require('path');

module.exports = {
  nodeModules: {
    modulesPath: path.join(__dirname, '../../../egg-born-module-'),
    jsPath: '/dist/backend.js',
  },

  projectModules: {
    modulesPath: path.join(__dirname, '../../../../src/module/'),
    jsPath: '/backend/src/main.js',
  },
};
