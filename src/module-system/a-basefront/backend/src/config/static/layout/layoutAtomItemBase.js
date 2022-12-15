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
      attachment: null, // null/true/false
      comment: null, // null/true/false
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
          name: 'baseLayoutDefault',
        },
        subnavbar: {
          policyDefault: true,
        },
      },
      content: {
        title: 'LayoutContent',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutDefault',
        },
        subnavbar: {
          policyDefault: true,
        },
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutAtomItemBase',
    atomRevision: 2,
    description: '',
    layoutTypeCode: 4,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
