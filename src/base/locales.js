/*
* @Author: zhennann
* @Date:   2017-09-27 14:30:39
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-27 15:52:06
*/

import Cookies from 'js-cookie';
import localeutil from 'egg-born-localeutil';

export default function(Vue, _locales) {

  // locales
  const locales = _locales || {};

  // mixin
  Vue.mixin({ beforeCreate() {

    Object.defineProperty(this, '$text', {
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

  } });

  return locales;
}
