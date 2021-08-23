module.exports = {
  extends: [
    './rules/best-practices', //
  ].map(require.resolve),
  env: {
    browser: true,
    node: true,
  },
  globals: {
    $: true,
    util: true,
    env: true,
    App: true,
    getApp: true,
    Page: true,
    wx: true,
    define: true,
  },
};
