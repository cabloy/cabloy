module.exports = {
  getCacheKey({ ctx }) {
    return `captcha:${ctx.meta.user.anonymousId()}`;
  },
};
