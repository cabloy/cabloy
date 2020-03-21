module.exports = {
  getCacheKey({ ctx, providerInstanceId }) {
    return `captcha:${ctx.meta.user.anonymousId()}:${providerInstanceId}`;
  },
};
