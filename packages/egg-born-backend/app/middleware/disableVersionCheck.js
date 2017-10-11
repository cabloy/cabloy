/*
* @Author: zhennann
* @Date:   2017-10-11 18:17:12
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-11 18:19:03
*/

module.exports = () => {
  return function* disableVersionCheck(next) {
    this.throw(403);
  };
};
