const versionManager = require('./bean/version.manager.js');
const beanPinyin = require('./bean/bean.pinyin.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    pinyin: {
      mode: 'ctx',
      bean: beanPinyin,
      global: true,
    },
  };
  return beans;
};
