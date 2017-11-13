module.exports = () => {
  return function* disableVersionCheck(next) {
    this.throw(403);
  };
};
