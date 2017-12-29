if (!Object.prototype.geto) {
  Object.defineProperty(Object.prototype, 'geto', {
    enumerable: false,
    get() {
      return function(name) {
        if (!this[name]) this[name] = {};
        return this[name];
      };
    },
  });
}
if (!Object.prototype.geta) {
  Object.defineProperty(Object.prototype, 'geta', {
    enumerable: false,
    get() {
      return function(name) {
        if (!this[name]) this[name] = [];
        return this[name];
      };
    },
  });
}
export default null;
