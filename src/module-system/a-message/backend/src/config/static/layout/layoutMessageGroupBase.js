module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'list',
          medium: 'list',
          large: 'list',
        },
      },
    },
    layouts: {
      base: {
        blocks: {
          title: {
            component: {
              module: 'a-message',
              name: 'messageGroupLayoutBlockListTitle',
            },
          },
        },
      },
      list: {
        title: 'LayoutList',
        component: {
          module: 'a-message',
          name: 'messageGroupLayoutList',
        },
        blocks: {
          items: {
            component: {
              module: 'a-message',
              name: 'messageGroupLayoutBlockListItems',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutMessageGroupBase',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 7,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
