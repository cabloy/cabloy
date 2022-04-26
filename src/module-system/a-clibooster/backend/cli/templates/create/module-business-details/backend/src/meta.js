module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {
        <%=argv.atomClassName%>: {
          info: {
            bean: '<%=argv.atomClassName%>',
            title: '<%=argv.atomClassNameCapitalize%>',
            tableName: '<%=argv.providerId%><%=argv.atomClassNameCapitalize%>',
            language: false,
            category: true,
            tag: true,
            details: ['default'],
          },
          actions: {},
          validator: '<%=argv.atomClassName%>',
          search: {
            validator: '<%=argv.atomClassName%>Search',
          },
        },
      },
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    detail: {
      details: {
        default: {
          info: {
            bean: '<%=argv.atomClassName%>',
            title: 'Details',
            tableName: '<%=argv.providerId%><%=argv.atomClassNameCapitalize%>Detail',
          },
          actions: {},
          validator: '<%=argv.atomClassName%>Detail',
        },
      },
    },
    validation: {
      validators: {
        // <%=argv.atomClassName%>
        <%=argv.atomClassName%>: {
          schemas: '<%=argv.atomClassName%>',
        },
        <%=argv.atomClassName%>Search: {
          schemas: '<%=argv.atomClassName%>Search',
        },
        // <%=argv.atomClassName%>Detail
        <%=argv.atomClassName%>Detail: {
          schemas: '<%=argv.atomClassName%>Detail',
        },
      },
      keywords: {},
      schemas,
    },
    index: {
      indexes: {
        <%=argv.providerId%><%=argv.atomClassNameCapitalize%>: 'createdAt,updatedAt,atomId',
        <%=argv.providerId%><%=argv.atomClassNameCapitalize%>Detail: 'createdAt,updatedAt,atomId,detailId',
      },
    },
  };
  return meta;
};
