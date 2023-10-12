module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const actionMeta = {
    create: {
      title: 'Create',
      actionModule: 'a-base',
      actionComponent: 'action',
      bulk: true,
      select: false,
      icon: { f7: '::add' },
      rightInherit: 'write',
      rightInheritStage: 'draft',
      mode: 'edit',
      createDelay: true,
    },
    read: {
      title: 'View',
      actionModule: 'a-base',
      actionComponent: 'action',
      icon: { f7: '::visibility' },
      rightInherit: 'read',
      rightInheritStage: '',
      mode: 'view',
    },
    write: {
      title: 'Edit',
      actionModule: 'a-base',
      actionComponent: 'action',
      icon: { f7: '::edit' },
      color: 'orange',
      rightInherit: 'write',
      rightInheritStage: 'draft',
      mode: 'edit',
      directShowOnSwipeout: true,
      directShowOnList: true,
    },
    delete: {
      title: 'Delete',
      actionModule: 'a-base',
      actionComponent: 'action',
      icon: { f7: '::delete' },
      color: 'red',
      rightInherit: 'write',
      rightInheritStage: 'draft',
      mode: 'edit',
      directShowOnSwipeout: true,
      directShowOnList: true,
    },
    clone: {
      title: 'Clone',
      actionModule: 'a-base',
      actionComponent: 'action',
      icon: { f7: ':outline:copy-outline' },
      rightInherit: 'write',
      rightInheritStage: 'draft',
      mode: 'edit',
    },
    moveUp: {
      title: 'Move Up',
      actionModule: 'a-base',
      actionComponent: 'action',
      icon: { f7: '::arrow-up' },
      rightInherit: 'write',
      rightInheritStage: 'draft',
      mode: 'edit',
      directShowOnList: true,
      disableOnItem: true,
    },
    moveDown: {
      title: 'Move Down',
      actionModule: 'a-base',
      actionComponent: 'action',
      icon: { f7: '::arrow-down' },
      rightInherit: 'write',
      rightInheritStage: 'draft',
      mode: 'edit',
      directShowOnList: true,
      disableOnItem: true,
    },
    save: {
      title: 'Save',
      actionModule: 'a-base',
      actionComponent: 'action',
      authorize: false,
      icon: { f7: '::save' },
      rightInherit: 'write',
      rightInheritStage: 'draft',
      mode: 'edit',
    },
    custom: {
      title: 'Custom',
    },
  };
  const actionMetaNotInline = {};
  for (const key in actionMeta) {
    actionMetaNotInline[key] = Object.assign({}, actionMeta[key], { mode: null });
  }
  return {
    detail: {
      // action: {
      //   create: 1,
      //   read: 2,
      //   write: 3,
      //   delete: 4,
      //   clone: 5,
      //   moveUp: 6,
      //   moveDown: 7,

      //   save: 51,

      //   custom: 100, // custom action start from custom
      // },
      actionMeta,
      actionMetaNotInline,
    },
  };
};
