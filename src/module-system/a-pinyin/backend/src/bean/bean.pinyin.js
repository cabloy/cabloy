const py = require('pinyin-pro');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Pinyin {
    translate({ word, options }) {
      return py.pinyin(word, options);
    }
  }
  return Pinyin;
};
