// eslint-disable-next-line
Object.prototype.geto = function(name) {
  if (!this[name]) this[name] = {};
  return this[name];
};
// eslint-disable-next-line
Object.prototype.geta = function(name) {
  if (!this[name]) this[name] = [];
  return this[name];
};
export default null;

