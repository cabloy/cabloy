module.exports = app => {
  const schemas = {};
  // filterTabGeneral
  schemas.filterTabGeneral = {
    type: 'object',
    properties: {
      mine: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'Mine',
        ebSearch: {
          tableAlias: null,
          ignoreValue: 0,
        },
      },
      star: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'UserStar',
        ebSearch: {
          tableAlias: null,
          ignoreValue: 0,
        },
      },
      label: {
        type: 'number',
        ebType: 'userLabel',
        ebTitle: 'UserLabel',
        ebParams: {
          optional: true,
        },
        ebSearch: {
          tableAlias: null,
          ignoreValue: 0,
        },
      },
      createdAt: {
        type: ['object', 'null'],
        ebType: 'component-action',
        ebTitle: 'Created Date',
        ebParams: {
          dateFormat: 'yyyy-mm-dd',
          header: false,
          toolbar: false,
        },
        ebRender: {
          actionModule: 'a-host',
          actionComponent: 'capabilities',
          name: '__test',
        },
        ebSearch: {
          // tableAlias: 'a',
          // operators: '>=',
        },
      },
      language: {
        type: 'string',
        ebType: 'language',
        ebTitle: 'Language',
        ebOptionsBlankAuto: true,
        ebParams: { openIn: 'sheet', closeOnSelect: true },
        ebDisplay: {
          expression: '_meta.host.atomClassBase && _meta.host.atomClassBase.language',
        },
        ebSearch: {
          tableAlias: null,
        },
      },
    },
  };
  return schemas;
};
