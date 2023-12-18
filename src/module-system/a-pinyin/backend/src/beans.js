const versionManager = require('./bean/version.manager.js');
const beanPinyin = require('./bean/bean.pinyin.js');

module.exports = {
  // version
  'version.manager': {
    bean: versionManager,
  },
  // global
  pinyin: {
    bean: beanPinyin,
    global: true,
  },
};
