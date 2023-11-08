module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // atomInfo
  schemas.atomInfo = {
    type: 'object',
    properties: {
      __groupCreateInfo: {
        ebType: 'group-flatten',
        ebTitle: 'CreateInfo',
      },
      userIdCreated: {
        ebType: 'userName',
        ebTitle: 'Creator',
        ebParams: {
          displayName: 'userName',
          displayAvatar: 'avatar',
        },
      },
      atomCreatedAt: {
        ebType: 'text',
        ebTitle: 'Created Time',
        ebParams: {
          dateFormat: true,
        },
      },
      __groupModificationInfo: {
        ebType: 'group-flatten',
        ebTitle: 'ModificationInfo',
      },
      userIdUpdated: {
        ebType: 'userName',
        ebTitle: 'Modifier',
        ebParams: {
          displayName: 'userNameUpdated',
          displayAvatar: 'avatarUpdated',
        },
      },
      atomUpdatedAt: {
        ebType: 'text',
        ebTitle: 'Modification Time',
        ebParams: {
          dateFormat: true,
        },
      },
    },
  };
  // atomInfoItemOnly
  schemas.atomInfoItemOnly = {
    type: 'object',
    properties: {
      userIdCreated: {
        ebType: 'userName',
        ebTitle: 'Username',
      },
      createdAt: {
        ebType: 'text',
        ebTitle: 'Created Time',
        ebParams: {
          dateFormat: true,
        },
      },
      updatedAt: {
        ebType: 'text',
        ebTitle: 'Modification Time',
        ebParams: {
          dateFormat: true,
        },
      },
    },
  };
  // atomInfoItemOnlySimple
  schemas.atomInfoItemOnlySimple = {
    type: 'object',
    properties: {
      createdAt: {
        ebType: 'text',
        ebTitle: 'Created Time',
        ebParams: {
          dateFormat: true,
        },
      },
      updatedAt: {
        ebType: 'text',
        ebTitle: 'Modification Time',
        ebParams: {
          dateFormat: true,
        },
      },
    },
  };
  return schemas;
};
