module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
        {{atomClassName}}: {
          info: {
            title: '{{atomClassNameCapitalize}}',
            tableName: '{{providerId}}{{atomClassNameCapitalize}}',
          },
          actions: {
          },
          flags: {
          },
          validator: '{{atomClassName}}',
          search: {
            validator: '{{atomClassName}}Search',
          },
        },
      },
      functions: {
        create{{atomClassNameCapitalize}}: {
          title: 'Create {{atomClassNameCapitalize}}',
          scene: 'create',
          autoRight: 1,
          atomClassName: '{{atomClassName}}',
          action: 'create',
          sorting: 1,
          menu: 1,
        },
        list{{atomClassNameCapitalize}}: {
          title: '{{atomClassNameCapitalize}} List',
          scene: 'list',
          autoRight: 1,
          atomClassName: '{{atomClassName}}',
          action: 'read',
          sorting: 1,
          menu: 1,
        },
      },
    },
    validation: {
      validators: {
        {{atomClassName}}: {
          schemas: '{{atomClassName}}',
        },
        {{atomClassName}}Search: {
          schemas: '{{atomClassName}}Search',
        },
      },
      keywords: {},
      schemas: {
        {{atomClassName}}: schemas.{{atomClassName}},
        {{atomClassName}}Search: schemas.{{atomClassName}}Search,
      },
    },
  };
  return meta;
};
