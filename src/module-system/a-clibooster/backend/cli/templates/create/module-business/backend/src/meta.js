module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticLayouts = require('./config/static/layouts.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {
        <%=argv.atomClassName%>: {
          info: {
            bean: '<%=argv.atomClassName%>',
            title: '<%=argv.atomClassNameCapitalize%>',
            model: '<%=argv.atomClassName%>',
            tableName: '<%=argv.providerId%><%=argv.atomClassNameCapitalize%>',
            language: false,
            category: false,
            tag: false,
            comment: false,
            attachment: false,
            layout: {
              config: {
                // atomList: 'layoutAtomList<%=argv.atomClassNameCapitalize%>',
              },
            },
          },
          actions: {},
          validator: '<%=argv.atomClassName%>',
          search: {
            validator: '<%=argv.atomClassName%>Search',
          },
        },
      },
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
    index: {
      indexes: {
        <%=argv.providerId%><%=argv.atomClassNameCapitalize%>: 'createdAt,updatedAt,atomId',
      },
    },
  };
  return meta;
};
