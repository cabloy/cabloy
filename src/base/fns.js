/*
* @Author: zhennann
* @Date:   2017-09-14 11:05:06
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-14 11:31:17
*/

export default function(fns) {
  return function(...arg) {
    fns = Array.isArray(fns) ? fns : [ fns ];
    fns.every(fn => {
      return (fn.call(this, ...arg) !== false);
    }, this);
  };
}
