if (!Object.prototype.geto) {
  Object.prototype.geto = function(name) {
    if (!this[name]) this[name] = {};
    return this[name];
  };
}
if (!Object.prototype.geta) {
  Object.prototype.geta = function(name) {
    if (!this[name]) this[name] = [];
    return this[name];
  };
}
export default null;
