import cookies from 'js-cookie';
import localeutil from 'egg-born-localeutil';

export default function(Vue) {

  // locales
  const locales = {};

  // beforeCreate
  const beforeCreate = function(ctx) {
    Object.defineProperty(ctx, '$text', {
      get() {
        return function(key) {
          if (arguments.length === 0 || !key) return null;
          // locale
          const locale = cookies.get('locale') || 'en-us';

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

          const args = new Array(arguments.length);
          args[0] = text;
          for (let i = 1; i < args.length; i++) {
            args[i] = arguments[i];
          }

          return localeutil.getText.apply(localeutil, args);
        };
      },
    });
  };

  return { locales, beforeCreate };
}
