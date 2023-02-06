module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async closeFormal({ key }) {
      // update atomClosed
      await this.modelAtom.update({
        id: key.atomId,
        atomClosed: 1,
      });
    }
  }
  return Atom;
};
