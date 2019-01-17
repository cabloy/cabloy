module.exports = app => {
  const meta = {};
  if (app.meta.isTest) {
    Object.assign(meta, {
      event: {
        declarations: {
          test: 'This is a test',
        },
        implementations: {
          'a-event:test': 'test/eventTest',
        },
      },
    });
  }
  return meta;
};
