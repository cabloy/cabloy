const path = require('path');

module.exports = {
  parser: 'vue-eslint-parser',
  extends: ['plugin:vue/essential', 'eslint-config-egg-born'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module',
    babelOptions: {
      configFile: path.join(__dirname, 'babel.config.js'),
    },
  },
};
