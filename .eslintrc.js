// 2022-04-28
const path = require('path');
const eslintConfigEggBorn = require.resolve('./packages/eslint-config-egg-born');

module.exports = {
  parser: 'vue-eslint-parser',
  extends: ['plugin:vue/essential', eslintConfigEggBorn],
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module',
    babelOptions: {
      configFile: path.join(__dirname, 'babel.config.js'),
    },
  },
};
