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
      createdAtx: {
        type: 'string',
        ebType: 'dateRange',
        ebTitle: 'Created Date',
        ebParams: {
          dateFormat: 'YYYY-MM-DD',
          header: false,
          toolbar: false,
        },
        ebSearch: {
          combine: {
            actionModule: 'a-baselayout',
            actionComponent: 'combineSearch',
            name: 'createdAt',
          },
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
