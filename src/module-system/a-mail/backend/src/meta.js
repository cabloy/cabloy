module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
        mail: {
          info: {
            title: 'Mail',
            tableName: 'aMail',
          },
          actions: {
          },
          flags: {
          },
          validator: 'mail',
          search: {
            validator: 'mailSearch',
          },
        },
      },
      functions: {
        createMail: {
          title: 'Create Mail',
          scene: 'create',
          autoRight: 1,
          atomClassName: 'mail',
          action: 'create',
          sorting: 1,
          menu: 1,
        },
        listMail: {
          title: 'Mail List',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'mail',
          action: 'read',
          sorting: 1,
          menu: 1,
        },
      },
    },
    validation: {
      validators: {
        mail: {
          schemas: 'mail',
        },
        mailSearch: {
          schemas: 'mailSearch',
        },
      },
      keywords: {},
      schemas: {
        mail: schemas.mail,
        mailSearch: schemas.mailSearch,
      },
    },
  };
  return meta;
};
