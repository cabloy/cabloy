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
    this.layout.current = this.container.layout || this.layout_get();
  },
  methods: {
    layout_get() {
      return (this.$view.size === 'small') ? 'list' : 'table';
    },
    async layout_prepareConfig() {
      // configDetailBase
      this.base.configDetailBase = this.$meta.config.modules['a-detail'].detail;
      // configDetail
      if (this.container.detailClass) {
        // load module
        await this.$meta.module.use(this.container.detailClass.module);
        this.base.configDetail = this.$meta.util.getProperty(this.$meta.config.modules[this.container.detailClass.module], `details.${this.container.detailClass.detailClassName}`);
      }
      // config
      this.base.config = this.base.configDetail ? this.$meta.util.extend({}, this.base.configDetailBase, this.base.configDetail) : this.base.configDetailBase;
      // layoutConfig
      this.layout.config = this.$meta.util.getProperty(this.base.config, `render.list.layouts.${this.layout.current}`);
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
      const blockConfig = this.layout.config.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.layout_getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
    layout_renderLayout() {
      return (
        <div>
          {this.layout_renderComponent()}
        </div>
      );
    },
  },
};
