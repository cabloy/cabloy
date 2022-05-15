export default {
  data() {
    return {
      layout: {
        layoutConfig: null,
        //
        configFull: null,
        current: null,
        config: null,
        instance: null,
        instanceExtend: null,
      },
    };
  },
  created() {},
  beforeDestroy() {
    this.layout_destroyInstanceExtend();
  },
  methods: {
    async layout_initLayoutConfig() {
      // layoutConfig
      this.layout.layoutConfig = await this.$store.dispatch('a/base/getLayoutConfig', 'a-basefront');
    },
    layout_destroyInstanceExtend() {
      if (this.layout.instanceExtend) {
        this.layout.instanceExtend.$destroy();
        this.layout.instanceExtend = null;
      }
    },
    async layout_createInstanceExtend() {
      // config component
      const configComponent = this.$meta.util.getProperty(this.layout.config, 'extend.component');
      if (!configComponent) {
        this.layout_destroyInstanceExtend();
        return;
      }
      // load module
      const moduleExtend = await this.$meta.module.use(configComponent.module);
      // create extend
      const options = {
        propsData: {
          layoutManager: this,
        },
      };
      const component = moduleExtend.options.components[configComponent.name];
      if (!component) throw new Error(`extend.component not found: ${configComponent.module}:${configComponent.name}`);
      const instanceExtend = this.$meta.util.createComponentInstance(component, options);
      // ready
      this.layout_destroyInstanceExtend();
      this.layout.instanceExtend = instanceExtend;
    },
    async layout_setInstance(instance) {
      await this.layout_createInstanceExtend();
      this.layout.instance = instance;
    },
    layout_clearInstance(instance) {
      if (this.layout.instance === instance) {
        this.layout.instance = null;
      }
    },
    layout_getDefault() {
      const layouts = this.layout_getLayouts();
      return layouts[0].name;
    },
    layout_calcCurrent(layoutCurrent, layoutDefault) {
      // 1 from params
      if (layoutCurrent) return layoutCurrent;
      // 2 from container
      if (this.container.layout) return this.container.layout;
      // 3 from custom
      const layoutConfigKeyCurrent = this.layout_onGetLayoutConfigKeyCurrent();
      const configCurrent = this.layout.layoutConfig[layoutConfigKeyCurrent];
      if (configCurrent) return configCurrent;
      // 4 from default
      return layoutDefault || this.layout_getDefault();
    },
    layout_onGetLayoutNames() {
      let configViewSize = this.$meta.util.getProperty(this.layout.configFull, 'info.layout.viewSize');
      if (this.container.mode) {
        configViewSize = configViewSize[this.container.mode];
      }
      return configViewSize[this.$view.size];
    },
    layout_getLayouts() {
      // layoutNames
      let layoutNames = this.layout_onGetLayoutNames();
      if (!Array.isArray(layoutNames)) {
        layoutNames = layoutNames.split(',');
      }
      // layouts
      const layouts = [];
      for (const layoutName of layoutNames) {
        const layoutConfig = this.layout.configFull.layouts[layoutName];
        if (layoutConfig) {
          layouts.push({
            name: layoutName,
            title: layoutConfig.title,
            titleLocale: this.$text(layoutConfig.title),
            config: layoutConfig,
          });
        }
      }
      return layouts;
    },
    async layout_prepareConfigLayout(layoutCurrent) {
      // configFull
      if (!this.layout.configFull) {
        const configFull = await this.layout_onPrepareConfigFull();
        const configBase = this.$meta.config.modules['a-base'].layoutManager.base;
        this.layout.configFull = this.$meta.util.extend({}, configBase, configFull);
      }
      // default
      const layoutDefault = this.layout_getDefault();
      // current
      layoutCurrent = this.layout_calcCurrent(layoutCurrent, layoutDefault);
      // layoutConfig
      let config = this.$meta.util.getProperty(this.layout.configFull, `layouts.${layoutCurrent}`);
      if (!config && layoutCurrent !== layoutDefault) {
        config = this.$meta.util.getProperty(this.layout.configFull, `layouts.${layoutDefault}`);
        layoutCurrent = layoutDefault;
      }
      if (!config) return null;
      // base
      const configBase = this.$meta.util.getProperty(this.layout.configFull, 'layouts.base');
      // combine
      this.layout.config = this.$meta.util.extend({}, configBase, config);
      this.layout.current = layoutCurrent;
      return layoutCurrent;
    },
    async layout_switchLayout(layoutCurrent) {
      if (layoutCurrent === this.layout.current) return true;
      // force clear status
      this.layout.current = null;
      this.layout.config = null;
      // this.layout.instance = null;
      this.subnavbar.enable = false;
      this.subnavbar.render = false;
      this.bottombar.enable = false;
      if (this.data.adapter) {
        this.data.adapter.providerName = null;
      }
      // prepare
      layoutCurrent = await this.layout_prepareConfigLayout(layoutCurrent);
      if (!layoutCurrent) {
        return false;
      }
      // save
      const layoutConfigKeyCurrent = this.layout_onGetLayoutConfigKeyCurrent();
      this.$store.commit('a/base/setLayoutConfigKey', {
        module: 'a-basefront',
        key: layoutConfigKeyCurrent,
        value: layoutCurrent,
      });
      return true;
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
      if (!this.layout.config) return null;
      return (
        <eb-component
          label={this.layout.current}
          module={this.layout.config.component.module}
          name={this.layout.config.component.name}
          options={this.layout_getComponentOptions()}
        ></eb-component>
      );
    },
    layout_getBlockComponentOptions({ blockConfig, info }) {
      return {
        props: {
          layoutManager: this,
          layout: this.layout.instance,
          blockConfig,
          info,
        },
      };
    },
    layout_renderBlock({ blockName, key, info, listItem }) {
      if (!this.base.ready) return null;
      if (!this.layout.instance) return null;
      const blockConfig = this.layout.config.blocks[blockName];
      if (!blockConfig) {
        const errorMessage = `${this.$text('Block Not Found')}: ${blockName}`;
        return <div>{errorMessage}</div>;
      }
      if (!blockConfig.component) {
        const errorMessage = `${this.$text('Block Component Not Found')}: ${blockName}`;
        return <div>{errorMessage}</div>;
      }
      const blockOptions = this.layout_getBlockComponentOptions({ blockConfig, info });
      if (listItem) {
        return (
          <eb-list-item-component
            key={key}
            module={blockConfig.component.module}
            name={blockConfig.component.name}
            options={blockOptions}
          ></eb-list-item-component>
        );
      }
      return (
        <eb-component
          key={key}
          module={blockConfig.component.module}
          name={blockConfig.component.name}
          options={blockOptions}
        ></eb-component>
      );
    },
    layout_renderSubnavbar() {
      if (!this.base.ready) return null;
      if (!this.layout.instance || !this.subnavbar.enable) return null;
      return this.layout_renderBlock({ blockName: 'subnavbar' });
    },
    layout_renderBottombar() {
      if (!this.base.ready) return null;
      if (!this.layout.instance || !this.bottombar.enable) return null;
      return <f7-toolbar position="bottom">{this.layout_renderBlock({ blockName: 'bottombar' })}</f7-toolbar>;
    },
    layout_renderCaptionInit() {
      if (this.base.ready) return null;
      return (
        <f7-nav-title>
          <div>{this.page_title}</div>
        </f7-nav-title>
      );
    },
    layout_extend_onTableColumns({ columns }) {
      const instanceExtend = this.layout.instanceExtend;
      if (instanceExtend && instanceExtend.onTableColumns) {
        columns = instanceExtend.onTableColumns({ columns });
      }
      return columns;
    },
    layout_extend_onFilterSchema({ schema, type }) {
      const instanceExtend = this.layout.instanceExtend;
      if (instanceExtend && instanceExtend.onFilterSchema) {
        schema = instanceExtend.onFilterSchema({ schema, type });
      }
      return schema;
    },
    layout_renderPage() {
      return (
        <eb-page
          withSubnavbar={this.subnavbar.enable}
          ptr={this.page_ptr()}
          onPtrRefresh={this.page_onRefresh}
          infinite={this.page_infinite()}
          infinitePreloader={false}
          onInfinite={this.page_onInfinite}
        >
          <eb-navbar eb-back-link="Back">
            {this.layout_renderCaptionInit()}
            {this.layout_renderBlock({ blockName: 'caption' })}
            {this.layout_renderBlock({ blockName: 'title' })}
            {this.layout_renderSubnavbar()}
          </eb-navbar>
          {this.layout_renderBottombar()}
          {this.layout_renderLayout()}
        </eb-page>
      );
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
      return <div>{this.layout_renderComponent()}</div>;
    },
  },
};
