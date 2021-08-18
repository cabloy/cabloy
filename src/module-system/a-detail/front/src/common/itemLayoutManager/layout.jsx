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
      // large/medium/small
      return this.$view.size === 'large' ? 'pc' : 'mobile';
    },
    async layout_prepareConfig(layoutCurrent) {
      // current
      this.layout.current = layoutCurrent || this.container.layout || this.layout_get();
      // configDetailBase
      this.base.configDetailBase = this.$meta.config.modules['a-detail'].detail;
      // configDetail
      this.base.configDetail = this.$meta.util.getProperty(this.$meta.config.modules[this.base.detailClass.module], `details.${this.base.detailClass.detailClassName}`);
      // config
      this.base.config = this.base.configDetail ? this.$meta.util.extend({}, this.base.configDetailBase, this.base.configDetail) : this.base.configDetailBase;
      // layoutConfig
      let _config = this.$meta.util.getProperty(this.base.config, `render.item.layouts.${this.layout.current}`);
      if (!_config) {
        _config = this.$meta.util.getProperty(this.base.config, 'render.item.layouts.mobile');
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
          layout: this.layout.instance,
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
      if (this.base.notfound) {
        return (
          <f7-card>
            <f7-card-header>{this.$text('Friendly Tips')}</f7-card-header>
            <f7-card-content>{this.$text('Not Found')}</f7-card-content>
          </f7-card>
        );
      }
      return (
        <div>
          {this.layout_renderComponent()}
          {this.actions_renderPopover()}
        </div>
      );
    },
  },
};
