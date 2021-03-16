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
          inherit: 'write',
          mode: 'edit',
          stage: 'draft',
        },
        read: {
          title: 'View',
          actionModule: moduleInfo.relativeName,
          actionPath: '/a/detail/detail/item?mode=view&detailId={{detailId}}&detailItemId={{detailItemId}}',
          icon: { material: 'visibility' },
          inherit: 'read',
          mode: '',
          stage: '',
        },
        write: {
          title: 'Edit',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          icon: { material: 'edit' },
          inherit: 'write',
          mode: 'edit',
          stage: 'draft',
        },
        delete: {
          title: 'Delete',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          icon: { material: 'delete' },
          inherit: 'write',
          mode: 'edit',
          stage: 'draft',
        },
        clone: {
          title: 'Clone',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          icon: { material: 'content_copy' },
          inherit: 'write',
          mode: 'edit',
          stage: 'draft',
        },
        save: {
          title: 'Save',
          actionModule: moduleInfo.relativeName,
          actionComponent: 'action',
          authorize: false,
          icon: { material: 'save' },
          inherit: 'write',
          mode: 'edit',
          stage: 'draft',
        },
        custom: {
          title: 'Custom',
        },
      },
    },
  };
};
