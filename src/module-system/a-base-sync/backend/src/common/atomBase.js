module.exports = app => {
  class AtomBase extends app.meta.AtomBase {
    // constructor(ctx) {
    //   super(ctx);
    // }
  }
  return AtomBase;
};
