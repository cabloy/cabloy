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
  created() {
  },
  methods: {
    layout_get() {
      return this.base.layoutConfig[this.base.layoutConfigKeyCurrent] || 'accordion';
    },
    async layout_prepareConfig(layoutCurrent) {
      // current
      this.layout.current = layoutCurrent || this.container.layout || this.layout_get();
      // configResourceBase
      this.base.configResourceBase = this.$meta.config.modules['a-basefront'].resource;
      // config
      this.base.config = this.base.configResourceBase;
      // layoutConfig
      let _config = this.$meta.util.getProperty(this.base.config, `render.tree.layouts.${this.layout.current}`);
      if (!_config) {
        _config = this.$meta.util.getProperty(this.base.config, 'render.tree.layouts.accordion');
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
      if (!this.base_ready) return null;
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
      if (!this.base_ready) return null;
      const blockConfig = this.layout.config.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.layout_getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
    layout_renderLayout() {
      return (
        <div>
          {this.layout_renderComponent()}
          {this.actions_renderPopover()}
        </div>
      );
    },
  },
};
