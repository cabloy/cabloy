module.exports = app => {
  const meta = {};
  if (app.meta.isTest) {
    Object.assign(meta, {
      event: {
        'a-event:test': 'test/eventTest',
      },
    });
  }
  return meta;
};
