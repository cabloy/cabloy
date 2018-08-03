module.exports = app => {
  const meta = {};
  if (app.meta.isTest) {
    Object.assign(meta, {
      hook: {
        before: [
          { path: '/a/base/auth/echo', route: 'test/hookTestBefore' },
        ],
        after: [
          { path: '/a/base/auth/echo', route: 'test/hookTestAfter' },
        ],
      },
    });
  }
  return meta;
};
