import Cookies from 'js-cookie';
import localeutil from 'egg-born-localeutil';

export default function(Vue, _locales) {

  // locales
  const locales = _locales || {};

  // beforeCreate
  Object.defineProperty(locales, '__beforeCreate', {
    enumerable: false,
    get() {
      return function(ctx) {
        return __beforeCreate(ctx);
      };
    },
  });

  function __beforeCreate(ctx) {
    Object.defineProperty(ctx, '$text', {
      get() {
        return function(key) {
          if (arguments.length === 0) return '';
          const locale = Cookies.get('locale') || 'en-us';
          const resource = locales[locale] || {};

          let text = resource[key];
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
  }

  return locales;
}
