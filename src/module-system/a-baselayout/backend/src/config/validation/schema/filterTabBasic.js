module.exports = app => {
  const schemas = {};
  // filterTabBasic
  schemas.filterTabBasic = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Atom Name',
        ebSearch: {
          // fieldName: 'atomName',
          // tableAlias: 'a',
          // ignoreValue:0,
          operators: 'like,likeLeft,likeRight,=', // {} } { =
          combine: {
            actionModule: 'a-basefront',
            actionComponent: 'combineSearch',
            name: 'atomName',
          },
        },
      },
      stage: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Stage',
        ebParams: { openIn: 'sheet', closeOnSelect: true },
        ebDisplay: {
          expression: '_meta.host.stages.length>1',
        },
        ebSearch: {
          tableAlias: null,
        },
      },
      role: {
        type: 'number',
        ebType: null, // 'role',
        ebTitle: 'TitleRoleOrg',
        ebParams: {
          roleIdStart: null,
          multiple: false,
          catalogOnly: false,
          leafOnly: false,
          roleTypes: [0, 1, 2, 3, 4],
          mapper: {
            role: 'itemId',
            roleName: 'atomName',
            roleNameLocale: 'atomNameLocale',
          },
        },
        ebSearch: {
          tableAlias: null,
          ignoreValue: 0,
        },
      },
      __divider: {
        ebType: 'divider',
      },
      atomClass: {
        type: 'object',
        ebType: 'atomClass',
        ebTitle: 'Atom Class',
        ebParams: {
          optional: true,
        },
        ebDisplay: {
          expression: '!_meta.host.container.atomClass',
        },
        ebSearch: {
          tableAlias: null,
        },
      },
    },
  };
  return schemas;
};
