module.exports = {
  getCacheKey({ ctx, providerInstanceId }) {
    return `captcha:${ctx.bean.user.anonymousId()}:${providerInstanceId}`;
  },
};
