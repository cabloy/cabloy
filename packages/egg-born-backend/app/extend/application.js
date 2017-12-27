module.exports = {

  // unRegister route
  unRegister(name) {
    const index = this.router.stack.findIndex(layer => layer.name && layer.name === name);
    if (index > -1) this.router.stack.splice(index, 1);
    return this;
  },

};
