module.exports = (options, app) => {
  return async function (ctx, next) {
    // crypto decrypt
    await ctx.bean.crypto.bodyDecrypt();
    // next
    await next();
    // crypto encrypt
    await ctx.bean.crypto.bodyEncrypt();
  };
};
