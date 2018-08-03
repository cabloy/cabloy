const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {
  const meta = {
    base: {
      functions: {
        settings: {
          title: 'Settings',
          scene: 'tools',
          actionPath: 'instance/list',
          sorting: 1,
          menu: 1,
        },
      },
    },
  };
  // only support in test
  if (app.meta.isTest) {
    // schemas
    const schemas = require('./config/validation/schemas.js')(app);
    // keywords
    const keywords = require('./config/validation/keywords.js')(app);
    // meta
    extend(true, meta, {
      settings: {
        user: {
          validator: 'userTest',
        },
        instance: {
          validator: 'instanceTest',
        },
      },
      validation: {
        validators: {
          userTest: {
            schemas: 'user,userExtra',
          },
          instanceTest: {
            schemas: 'instance',
          },
        },
        keywords: {
          'x-languages': keywords.languages,
        },
        schemas: {
          user: schemas.user,
          userExtra: schemas.userExtra,
          instance: schemas.instance,
        },
      },
    });
  }
  return meta;
};
