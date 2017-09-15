/**
 * @Author: wind
 * @Date:   2017-07-26T20:57:35+08:00
 * @Last modified by:   wind
 * @Last modified time: 2017-08-24T16:19:10+08:00
 */


module.exports = {
  parser: 'babel-eslint',
  extends: 'eslint-config-egg',
  parserOptions:
  {
    // ecmaVersion: 6, // 指定ECMAScript支持的版本，6为ES6
    sourceType: 'module',
  },
};