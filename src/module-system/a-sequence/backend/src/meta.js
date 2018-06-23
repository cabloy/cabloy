module.exports = app => {
  const meta = {};
  if (app.meta.isTest || app.meta.isLocal) {
    // meta
    Object.assign(meta, {
      sequence: {
        providers: {
          test: {
            start: 0,
            expression({ ctx, value }) {
              return ++value;
            },
          },
        },
      },
    });
  }
  return meta;
};
