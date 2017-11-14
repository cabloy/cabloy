module.exports = () => {
  return function* disableVersionCheck(next) {
    // only access from localhost
    if (this.ip !== '127.0.0.1') this.throw(403);
    // next
    yield next;
  };
};
