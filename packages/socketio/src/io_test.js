export default () => {
  const io = {
    __test: true,
    __testPerformAction(i) {
      this.performAction({ url: '/a/socketio/test/echo', body: { echo: i } })
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    _initialize() {
      this.registerOnConnect(() => {
        if (!this.__test) return;
        for (const i of [1, 2]) {
          this.__testPerformAction(i);
        }
      });
    },
  };
  return io;
};
