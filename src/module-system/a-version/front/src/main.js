/*
* @Author: zhennann
* @Date:   2017-09-08 21:31:56
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-11 16:35:02
*/

let Vue;

// import css
// eslint-disable-next-line
import CSS from './css/module.css';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  return cb({
    routes: require('./routes.js').default,
    locales: require('../config/locales.js').default,
  });
}

// export
export default {
  install,
};
