module.exports = {
  systemRoles: [ 'root', 'anonymous', 'authenticated', 'template', 'system', 'registered', 'activated', 'superuser', 'organization', 'internal', 'external' ],
  atom: {
    stage: {
      draft: 0,
      archive: 1,
      history: 2,
    },
    action: {
      create: 1,
      read: 2,
      write: 3,
      delete: 4,
      clone: 5,
      deleteBulk: 6,
      exportBulk: 7,
      save: 51,
      submit: 52,
      custom: 100, // custom action start from custom
    },
    actionMeta: {
      create: {
        title: 'Create',
        actionComponent: 'action',
        bulk: true,
        select: false,
        icon: { material: 'add' },
      },
      read: {
        title: 'View',
        actionPath: 'atom/view?atomId={{atomId}}&itemId={{itemId}}&atomClassId={{atomClassId}}&module={{module}}&atomClassName={{atomClassName}}&atomClassIdParent={{atomClassIdParent}}',
        icon: { material: 'visibility' },
      },
      write: {
        title: 'Edit',
        actionComponent: 'action',
        icon: { material: 'edit' },
      },
      delete: {
        title: 'Delete',
        actionComponent: 'action',
        icon: { material: 'delete' },
      },
      clone: {
        title: 'Clone',
        actionComponent: 'action',
        icon: { material: 'content_copy' },
      },
      deleteBulk: {
        title: 'Delete',
        actionComponent: 'actionBulk',
        bulk: true,
        select: true,
        icon: { material: 'delete' },
      },
      exportBulk: {
        title: 'Export',
        actionComponent: 'actionBulk',
        bulk: true,
        select: null,
        icon: { material: 'cloud_download' },
      },
      save: {
        title: 'Save',
        actionComponent: 'action',
        authorize: false,
        icon: { material: 'save' },
      },
      submit: {
        title: 'Submit',
        actionComponent: 'action',
        authorize: false,
        icon: { material: 'done' },
      },
      custom: {
        title: 'Custom',
      },
    },
  },
  function: {
    scene: {
      // default: 0,
      create: 1,
      list: 2,
      // report: 20,
      tools: 50,
      // custom: 100,
    },
  },
};
