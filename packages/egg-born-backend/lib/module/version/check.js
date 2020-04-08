module.exports = async function(app) {
  // ctx
  const ctx = app.createAnonymousContext({
    method: 'post',
    url: '/api/a/version',
  });
  // version start
  await ctx.performAction({
    method: 'post',
    url: '/a/version/version/start',
  });
};
