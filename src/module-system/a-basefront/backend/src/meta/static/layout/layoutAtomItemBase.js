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
        timeline: {
          component: {
            module: 'a-flowtimeline',
            name: 'timeline',
          },
        },
        blocks: {
          caption: {
            component: {
              module: 'a-baselayout',
              name: 'itemLayoutBlockDefaultCaption',
            },
          },
          mainBefore: {
            component: {
              module: 'a-baselayout',
              name: 'itemLayoutBlockDefaultMainBefore',
            },
          },
          timeline: {
            component: {
              module: 'a-flowtimeline',
              name: 'itemLayoutBlockDefaultTimeline',
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
        blocks: {
          subnavbar: {
            policy: 'default',
          },
        },
      },
      content: {
        title: 'LayoutContent',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutDefault',
        },
        blocks: {
          subnavbar: {
            policy: 'default',
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutAtomItemBase',
    atomRevision: 8,
    description: '',
    layoutTypeCode: 4,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
