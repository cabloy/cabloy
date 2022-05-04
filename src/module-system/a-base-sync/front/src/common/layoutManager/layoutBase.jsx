export default {
  data() {
    return {
      layoutBase: {
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
    this.layoutBase_destroyInstanceExtend();
  },
  methods: {
    async layoutBase_initLayoutConfig() {
      // layoutConfig
      this.layoutBase.layoutConfig = await this.$store.dispatch('a/base/getLayoutConfig', 'a-basefront');
    },
    layoutBase_destroyInstanceExtend() {
      if (this.layoutBase.instanceExtend) {
        this.layoutBase.instanceExtend.$destroy();
        this.layoutBase.instanceExtend = null;
      }
    },
    async layoutBase_createInstanceExtend() {
      // config component
      const configComponent = this.$meta.util.getProperty(this.layoutBase.config, 'extend.component');
      if (!configComponent) {
        this.layoutBase_destroyInstanceExtend();
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
      this.layoutBase_destroyInstanceExtend();
      this.layoutBase.instanceExtend = instanceExtend;
    },
    async layoutBase_setInstance(instance) {
      await this.layoutBase_createInstanceExtend();
      this.layoutBase.instance = instance;
    },
    layoutBase_clearInstance(instance) {
      if (this.layoutBase.instance === instance) {
        this.layoutBase.instance = null;
      }
    },
    layoutBase_getDefault() {
      const layoutConfigKeyCurrent = this.layout_onGetLayoutConfigKeyCurrent();
      const configCurrent = this.layoutBase.layoutConfig[layoutConfigKeyCurrent];
      if (configCurrent) return configCurrent;
      // from config
      const layouts = this.layout_onGetLayouts();
      return layouts[0].name;
    },
    async layoutBase_prepareConfigLayout(layoutCurrent) {
      // configFull
      if (!this.layoutBase.configFull) {
        this.layoutBase.configFull = await this.layout_onPrepareConfigFull();
      }
      // current
      this.layoutBase.current = layoutCurrent || this.container.layout || this.layoutBase_getDefault();
      // layoutConfig
      const config = this.$meta.util.getProperty(this.layoutBase.configFull, `layouts.${this.layoutBase.current}`);
      if (!config) return false;
      const configBase = this.$meta.util.getProperty(this.layoutBase.configFull, 'layouts.base');
      this.layoutBase.config = configBase ? this.$meta.util.extend({}, configBase, config) : config;
      return true;
    },
    async layoutBase_switchLayout(layoutCurrent) {
      if (layoutCurrent === this.layoutBase.current) return true;
      // force clear status
      this.layoutBase.current = null;
      this.layoutBase.config = null;
      // this.layoutBase.instance = null;
      this.subnavbar.enable = false;
      this.subnavbar.render = false;
      this.bottombar.enable = false;
      if (this.data.adapter) {
        this.data.adapter.providerName = null;
      }
      // prepare
      if (!this.layoutBase_prepareConfigLayout(layoutCurrent)) {
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
    layoutBase_getComponentOptions() {
      return {
        props: {
          layoutManager: this,
          layoutConfig: this.layoutBase.config,
        },
      };
    },
    layoutBase_renderComponent() {
      if (!this.base.ready) return null;
      return (
        <eb-component
          module={this.layoutBase.config.component.module}
          name={this.layoutBase.config.component.name}
          options={this.layoutBase_getComponentOptions()}
        ></eb-component>
      );
    },
    layoutBase_getBlockComponentOptions({ blockConfig, info }) {
      return {
        props: {
          layoutManager: this,
          layout: this.layoutBase.instance,
          blockConfig,
          info,
        },
      };
    },
    layoutBase_renderBlock({ blockName, key, info, listItem }) {
      if (!this.base.ready) return null;
      if (!this.layoutBase.instance) return null;
      const blockConfig = this.layoutBase.config.blocks[blockName];
      if (!blockConfig) {
        const errorMessage = `${this.$text('Block Not Found')}: ${blockName}`;
        return <div>{errorMessage}</div>;
      }
      if (!blockConfig.component) {
        const errorMessage = `${this.$text('Block Component Not Found')}: ${blockName}`;
        return <div>{errorMessage}</div>;
      }
      const blockOptions = this.layoutBase_getBlockComponentOptions({ blockConfig, info });
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
    layoutBase_renderSubnavbar() {
      if (!this.base.ready) return null;
      if (!this.layoutBase.instance || !this.subnavbar.enable) return null;
      return this.layoutBase_renderBlock({ blockName: 'subnavbar' });
    },
    layoutBase_renderBottombar() {
      if (!this.base.ready) return null;
      if (!this.layoutBase.instance || !this.bottombar.enable) return null;
      return <f7-toolbar position="bottom">{this.layout_renderBlock({ blockName: 'bottombar' })}</f7-toolbar>;
    },
    layoutBase_renderCaptionInit() {
      if (this.base.ready) return null;
      return (
        <f7-nav-title>
          <div>{this.page_title}</div>
        </f7-nav-title>
      );
    },
    layoutBase_renderPage() {
      return (
        <eb-page
          withSubnavbar={this.subnavbar.enable}
          ptr
          onPtrRefresh={this.page_onRefresh}
          infinite
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
  },
};
