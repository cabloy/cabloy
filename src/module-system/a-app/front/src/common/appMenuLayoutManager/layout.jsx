const configFull = {
  info: {
    layout: ['default'],
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
        title: {
          component: {
            module: 'a-baselayout',
            name: 'itemLayoutBlockDefaultTitle',
          },
        },
        subnavbar: {
          component: {
            module: 'a-baselayout',
            name: 'itemLayoutBlockDefaultSubnavbar',
          },
        },
        main: {
          component: {
            module: 'a-baselayout',
            name: 'itemLayoutBlockDefaultMain',
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

export default {
  data() {
    return {
      layout: {},
    };
  },
  methods: {
    layout_onGetLayoutConfigKeyCurrent() {
      const appKey = this.container.appKey;
      return `appMenu.${appKey}.render.list.layout.current`;
    },
    layout_onGetLayouts() {
      // layoutNames
      let layoutNames = this.layoutBase.configFull.info.layout;
      if (!Array.isArray(layoutNames)) {
        layoutNames = layoutNames.split(',');
      }
      // layouts
      const layouts = [];
      for (const layoutName of layoutNames) {
        const layoutConfig = this.layoutBase.configFull.layouts[layoutName];
        layouts.push({
          name: layoutName,
          title: this.$text(layoutConfig.title),
          config: layoutConfig,
        });
      }
      return layouts;
    },
    async layout_onPrepareConfigFull() {
      return configFull;
    },
    layout_renderLayout() {
      return <div>{this.layoutBase_renderComponent()}</div>;
    },
  },
};
