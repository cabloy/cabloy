export default () => {
  const io = {
    __test: false,
    // __test: true,
    __testPerformAction(i) {
      for (const method of ['get', 'post']) {
        this.performAction({ method, url: `/a/socketio/test/echo?method=${method}`, body: { echo: i } })
          .then(data => {
            console.log(method, data);
          })
          .catch(err => {
            console.log(err);
          });
      }
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
