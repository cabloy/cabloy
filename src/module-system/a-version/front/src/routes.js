/*
* @Author: zhennann
* @Date:   2017-09-25 23:10:35
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-11 15:31:23
*/

function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'check', component: load('check') },
];
