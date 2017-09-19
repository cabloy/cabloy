/*
* @Author: zhennann
* @Date:   2017-09-19 23:32:28
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-19 23:33:20
*/

module.exports = {

  /**
   * `app/public` dir static serve
   * @member {Object} Plugin#static
   * @property {Boolean} enable - `true` by default
   * @since 1.0.0
   */
  static: {
    enable: false,
    package: 'egg-static',
  },

  /**
   * view plugin
   * @member {Function} Plugin#view
   * @property {Boolean} enable - `true` by default
   * @since 1.0.0
   */
  view: {
    enable: false,
    package: 'egg-view',
  },

};
