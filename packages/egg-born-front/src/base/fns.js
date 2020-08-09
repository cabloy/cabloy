export default function(fns) {
  return function(...arg) {
    fns = Array.isArray(fns) ? fns : [ fns ];
    fns.every(fn => {
      return (fn.call(this, ...arg) !== false);
    }, this);
  };
}
