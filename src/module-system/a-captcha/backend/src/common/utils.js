module.exports = {
  getCacheKey({ user }) {
    return `captcha:${user.id}`;
  },
};
