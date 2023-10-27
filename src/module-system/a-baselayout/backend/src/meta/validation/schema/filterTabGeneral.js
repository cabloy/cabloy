module.exports = app => {
  const schemas = {};
  // filterTabGeneral
  schemas.filterTabGeneral = {
    type: 'object',
    properties: {
      // need not
      stage: {
        type: 'string',
        // ebType: 'select',
        ebTitle: 'Stage',
        ebParams: { openIn: 'sheet', closeOnSelect: true },
        ebDisplay: {
          expression: '_meta.host.stages.length>1',
        },
        ebSearch: {
          tableAlias: null,
        },
      },
      mine: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'Mine',
        ebDisplay: {
          expression:
            '_meta.host.stage==="formal" && (!_meta.host.container.options || !_meta.host.container.options.mine)',
        },
        ebSearch: {
          tableAlias: null,
          ignoreValue: 0,
        },
      },
      star: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'UserStar',
        ebDisplay: {
          expression: '_meta.host.stage==="formal"',
        },
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
        ebDisplay: {
          expression: '_meta.host.stage==="formal"',
        },
        ebSearch: {
          tableAlias: null,
          ignoreValue: 0,
        },
      },
      createdAt: {
        type: 'string',
        ebType: 'dateRange',
        ebTitle: 'Created Date',
        ebParams: {
          dateFormat: 'YYYY-MM-DD',
          header: false,
          toolbar: true,
        },
        ebSearch: {
          tableAlias: 'a',
          combine: {
            actionModule: 'a-basefront',
            actionComponent: 'combineSearch',
            name: 'dateRange',
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
