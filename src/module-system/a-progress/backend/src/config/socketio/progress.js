module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  async function onPublish({ io, ctx, path, message, options, user }) {
    // only by system
    if (user.id !== 0) {
      ctx.throw(403);
    }
  }

  // async function onDelivery({ io, ctx, path, options, message, messageSync, messageClass }) {
  // }
  const progress = {
    info: {
      title: 'Progress',
      persistence: false,
    },
    callbacks: {
      onPublish,
      // onDelivery,
    },
  };
  return progress;
};
