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
      create: { title: 'Create', actionComponent: 'action', bulk: true, select: false },
      read: { title: 'View', actionPath: 'atom/view?atomId={{atomId}}&itemId={{itemId}}&atomClassId={{atomClassId}}&module={{module}}&atomClassName={{atomClassName}}&atomClassIdParent={{atomClassIdParent}}' },
      write: { title: 'Edit', actionComponent: 'action' },
      delete: { title: 'Delete', actionComponent: 'action' },
      clone: { title: 'Clone', actionComponent: 'action' },
      deleteBulk: { title: 'Delete', actionComponent: 'action', bulk: true, select: true },
      exportBulk: { title: 'Export', actionComponent: 'action', bulk: true, select: null },
      save: { title: 'Save', actionComponent: 'action', authorize: false },
      submit: { title: 'Submit', actionComponent: 'action', authorize: false },
      custom: { title: 'Custom' },
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
