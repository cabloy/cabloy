module.exports = app => {
  const meta = {};
  if (app.meta.isTest || app.meta.isLocal) {
    // schemas
    const schemas = require('./config/validation/schemas.js')(app);
    // keywords
    const keywords = require('./config/validation/keywords.js')(app);
    // meta
    Object.assign(meta, {
      validation: {
        validators: {
          test: {
            schemas: 'root,extra',
          },
        },
        keywords: {
          'x-languages': keywords.languages,
        },
        schemas: {
          root: schemas.root,
          extra: schemas.extra,
        },
      },
    });
  }
  return meta;
};
