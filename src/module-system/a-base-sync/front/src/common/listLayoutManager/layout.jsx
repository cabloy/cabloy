export default {
  data() {
    return {
      layout: {
        current: null,
        config: null,
      },
    };
  },
  computed: {
    layout_componentInstance() {
      return this.$refs.layout && this.$refs.layout.getComponentInstance();
    },
  },
  created() {
    this.layout.current = this.container.layout || this.layout_get();
  },
  methods: {
    layout_get() {
      return this.$view.size === 'small' ? 'list' : 'table';
    },
    async layout_prepareConfig() {
      // configAtomBase
      this.configAtomBase = this.$config.atom;
      // configAtom
      if (this.container.atomClass) {
        // load module
        await this.$meta.module.use(this.container.atomClass.module);
        this.configAtom = this.$meta.util.getProperty(this.$meta.config.modules[this.container.atomClass.module], `atoms.${this.container.atomClass.atomClassName}`);
      }
      // layoutConfig
      const layoutConfigBase = this.configAtomBase.render.list.layouts[this.layout.current];
      const layoutConfigAtom = this.$meta.util.getProperty(this.configAtom, `render.list.layouts.${this.layout.current}`);
      this.layout.config = this.$meta.util.extend({}, layoutConfigBase, layoutConfigAtom);
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
      if (!this.ready) return null;
      return <eb-component ref='layout' module={this.layout.config.component.module} name={this.layout.config.component.name} options={this.layout_getComponentOptions()}></eb-component>;
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
      if (!this.ready) return null;
      const blockConfig = this.layout.config.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.layout_getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
    layout_renderLayout() {
      return (
        <div>
          {this.layout_renderComponent()}
          {this.order_renderPopover()}
          {this.create_renderPopoverActions()}
        </div>
      );
    },
  },
};
