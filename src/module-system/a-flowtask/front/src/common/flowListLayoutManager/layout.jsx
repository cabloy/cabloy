export default {
  data() {
    return {
      layout: {
        current: null,
        config: null,
        instance: null,
      },
    };
  },
  created() {},
  methods: {
    layout_get() {
      return this.$view.size === 'small' ? 'list' : 'table';
    },
    async layout_prepareConfig(layoutCurrent) {
      // current
      this.layout.current = layoutCurrent || this.container.layout || this.layout_get();
      // configFlowBase
      this.base.configFlowBase = this.$meta.config.modules['a-flowtask'].flow;
      // config
      this.base.config = this.base.configFlowBase;
      // layoutConfig
      let _config = this.$meta.util.getProperty(this.base.config, `render.list.layouts.${this.layout.current}`);
      if (!_config) {
        _config = this.$meta.util.getProperty(this.base.config, 'render.list.layouts.list');
      }
      this.layout.config = _config;
    },
    layout_getComponentOptions() {
      return {
        props: {
          layoutManager: this,
          layoutConfig: this.layout.config,
        },
      };
    },
    layout_renderComponent() {
      if (!this.base.ready) return null;
      return <eb-component module={this.layout.config.component.module} name={this.layout.config.component.name} options={this.layout_getComponentOptions()}></eb-component>;
    },
    layout_getBlockComponentOptions({ blockConfig }) {
      return {
        props: {
          layoutManager: this,
          blockConfig,
        },
      };
    },
    layout_renderBlock({ blockName }) {
      if (!this.base.ready) return null;
      if (!this.layout.instance) return null;
      const blockConfig = this.layout.config.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.layout_getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
    layout_renderLayout() {
      return <div>{this.layout_renderComponent()}</div>;
    },
  },
};
