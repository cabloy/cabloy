module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return {
    detail: {
      action: {
        create: 1,
        read: 2,
        write: 3,
        delete: 4,
        clone: 5,

        save: 51,

        custom: 100, // custom action start from custom
      },
      actionMeta: {
        create: {
          title: 'Create',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          bulk: true,
          icon: { material: 'add' },
        },
        read: {
          title: 'View',
          actionModule: moduleInfo.relativeName,
          actionPath: '/a/detail/detail/item?mode=view&detailId={{detailId}}&detailItemId={{detailItemId}}',
          icon: { material: 'visibility' },
        },
        write: {
          title: 'Edit',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          icon: { material: 'edit' },
        },
        delete: {
          title: 'Delete',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          icon: { material: 'delete' },
        },
        clone: {
          title: 'Clone',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          icon: { material: 'content_copy' },
        },
        save: {
          title: 'Save',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          authorize: false,
          icon: { material: 'save' },
        },
        custom: {
          title: 'Custom',
        },
      },
    },
  };
};
