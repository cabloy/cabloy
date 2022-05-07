module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          view: {
            small: 'default',
            medium: 'default',
            large: 'default',
          },
          edit: {
            small: 'default',
            medium: 'default',
            large: 'default',
          },
        },
      },
      attachment: true,
      comment: true,
    },
    layouts: {
      base: {
        blocks: {
          caption: {
            component: {
              module: 'a-baselayout',
              name: 'itemLayoutBlockDefaultCaption',
            },
          },
        },
      },
      default: {
        title: 'LayoutInfo',
        component: {
          module: 'a-baselayout',
          name: 'itemLayoutDefault',
        },
        blocks: {},
      },
      content: {
        title: 'LayoutContent',
        component: {
          module: 'a-baselayout',
          name: 'itemLayoutDefault',
        },
        blocks: {},
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutAtomItemBase',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 4,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
