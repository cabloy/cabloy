module.exports = ctx => {
  class IOMessage extends ctx.app.meta.IOMessageBase(ctx) {
  }
  return IOMessage;
};
