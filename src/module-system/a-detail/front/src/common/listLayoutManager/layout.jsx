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
      // return 'table';
      return this.$view.size === 'small' ? 'list' : 'table';
    },
    async layout_prepareConfig(layoutCurrent) {
      // current
      this.layout.current = layoutCurrent || this.container.layout || this.layout_get();
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
      return <div>{this.layout_renderComponent()}</div>;
    },
    layout_renderTitle() {
      return (
        <f7-list-item groupTitle>
          <div class="detail-list-title-container">
            {this.layout_renderTitleLeft()}
            {this.layout_renderTitleRight()}
          </div>
        </f7-list-item>
      );
    },
    layout_renderTitleLeft() {
      const title = this.container.title;
      return <div class="actions-block actions-block-left">{title}</div>;
    },
    layout_renderTitleRight() {
      const children = this.bulk_renderActionsRight();
      return <div class="actions-block actions-block-right">{children}</div>;
    },
  },
};
