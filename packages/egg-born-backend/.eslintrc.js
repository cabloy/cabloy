module.exports = {
  parser: 'babel-eslint',
  extends: 'eslint-config-egg',
  parserOptions:
  {
    // ecmaVersion: 6, // 指定ECMAScript支持的版本，6为ES6
    sourceType: 'module',
  },
  rules: {
    'no-useless-constructor': 0
  },
};