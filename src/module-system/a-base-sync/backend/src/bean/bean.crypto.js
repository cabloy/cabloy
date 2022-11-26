module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class ClassCrypto {
    async bodyDecrypt() {}

    async bodyEncrypt() {}
  }
  return ClassCrypto;
};
