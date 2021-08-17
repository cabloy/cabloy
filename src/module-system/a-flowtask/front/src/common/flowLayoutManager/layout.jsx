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
      return this.$view.size === 'small' ? 'mobile' : 'pc';
    },
    async layout_prepareConfig(layoutCurrent) {
      // current
      this.layout.current = layoutCurrent || this.container.layout || this.layout_get();
      // configFlowBase
      this.base.configFlowBase = this.$meta.config.modules['a-flowtask'].flow;
      // configAtom
      const atomClass = this.base_atomClass;
      if (atomClass) {
        // load module
        await this.$meta.module.use(atomClass.module);
        this.base.configAtom = this.$meta.util.getProperty(this.$meta.config.modules[atomClass.module], `flows.${atomClass.atomClassName}`);
      }
      // config
      this.base.config = this.base.configAtom ? this.$meta.util.extend({}, this.base.configFlowBase, this.base.configAtom) : this.base.configFlowBase;
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
      if (this.base.notfound) {
        return (
          <f7-card>
            <f7-card-header>{this.$text('Friendly Tips')}</f7-card-header>
            <f7-card-content>{this.$text('FlowOrTaskNotExists')}</f7-card-content>
          </f7-card>
        );
      }
      return <div>{this.layout_renderComponent()}</div>;
    },
  },
};
