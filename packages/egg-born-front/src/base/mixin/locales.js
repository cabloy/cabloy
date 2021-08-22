import localeutil from 'egg-born-localeutil';

export default function (Vue) {
  // locales
  const locales = {};

  Vue.prototype.$text = function (...args) {
    const locale = Vue.prototype.$meta.util.getLocale();
    return getText(locale, ...args);
  };
  Vue.prototype.$text.locale = function (locale, ...args) {
    return getText(locale, ...args);
  };

  function getText(locale, ...args) {
    const key = args[0];
    if (!key) return null;

    // try locale
    let resource = locales[locale] || {};
    let text = resource[key];
    if (text === undefined && locale !== 'en-us') {
      // try en-us
      resource = locales['en-us'] || {};
      text = resource[key];
    }
    // equal key
    if (text === undefined) {
      text = key;
    }
    // format
    args[0] = text;
    return localeutil.getText.apply(localeutil, args);
  }

  return { locales, beforeCreate: null };
}
