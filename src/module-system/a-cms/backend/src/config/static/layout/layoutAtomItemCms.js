module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          view: {
            small: 'content,default',
            medium: 'content,default',
            large: 'content,default',
          },
          edit: {
            small: 'default,content',
            medium: 'default,content',
            large: 'default,content',
          },
        },
      },
    },
    layouts: {
      base: {
        extend: {
          component: {
            module: 'a-cms',
            name: 'itemLayoutExtend',
          },
        },
      },
      default: {
        title: 'LayoutInfo',
        component: {
          module: 'a-baselayout',
          name: 'itemLayoutDefault',
        },
        blocks: {
          main: {
            component: {
              module: 'a-cms',
              name: 'itemLayoutBlockMobileMain',
            },
            info: true,
          },
        },
      },
      content: {
        title: 'LayoutContent',
        component: {
          module: 'a-baselayout',
          name: 'itemLayoutDefault',
        },
        blocks: {
          main: {
            component: {
              module: 'a-cms',
              name: 'itemLayoutBlockMobileMain',
            },
            markdown: true,
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Cms',
    atomStaticKey: 'layoutAtomItemCms',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 4,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
