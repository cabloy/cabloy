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
        'a-baselayout.layout': {
          items: staticLayouts,
        },
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
            layout: {
              config: {
                detailList: 'layoutDetailList<%=argv.atomClassNameCapitalize%>',
              },
            },
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
