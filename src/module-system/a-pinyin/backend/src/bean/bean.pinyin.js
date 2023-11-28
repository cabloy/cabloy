const py = require('pinyin-pro');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Pinyin {
    translate({ text, options }) {
      return py.pinyin(text, options);
    }

    match({ text, pinyin, options }) {
      return py.match(text, pinyin, options);
    }

    convert({ pinyin, options }) {
      return py.convert(pinyin, options);
    }

    custom({ config }) {
      return py.customPinyin(config);
    }

    html({ text, options }) {
      return py.html(text, options);
    }

    polyphonic({ text, options }) {
      return py.polyphonic(text, options);
    }
  }
  return Pinyin;
};
