export default {
  data() {
    return {};
  },
  methods: {
    layout_onGetLayoutConfigKeyCurrent() {
      const atomClassKey = `${this.base.atomClass.module}_${this.base.atomClass.atomClassName}`;
      return `atom.${atomClassKey}.render.item.layout.current.${this.container.mode}.${this.$view.size}`;
    },
    layout_onGetLayoutNames() {
      const configViewSize = this.$meta.util.getProperty(this.layout.configFull, 'info.layout.viewSize');
      return configViewSize[this.container.mode][this.$view.size];
    },
    async layout_onPrepareConfigFull() {
      const atomClass = this.base.atomClass;
      // atom base
      let layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
        layoutKey: 'a-basefront:layoutAtomItemBase',
      });
      this.base.configAtomBase = layoutItem.content;
      // atom cms
      const atomClassBase = this.getAtomClass(atomClass);
      if (atomClassBase.cms) {
        layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
          layoutKey: 'a-cms:layoutAtomItemCms',
        });
        this.base.configAtomCms = layoutItem.content;
      }
      // atom
      const atomLayoutKey = this.$meta.util.getProperty(atomClassBase, 'layout.config.atomItem');
      if (atomLayoutKey) {
        layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
          layoutKey: atomLayoutKey,
        });
        this.base.configAtom = layoutItem.content;
      }
      return this.$meta.util.extend({}, this.base.configAtomBase, this.base.configAtomCms, this.base.configAtom);
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
    layout_getMetaLayoutConfig(atomClass) {
      const atomClassBase = this.getAtomClass(atomClass);
      const layoutConfig = this.$meta.util.getProperty(atomClassBase, 'layout.config');
      if (layoutConfig) return layoutConfig;
      return {
        module: atomClass.module,
        name: atomClass.atomClassName,
      };
    },
    layout_getDefault() {
      const layoutConfigKeyCurrent = this.base_getLayoutConfigKeyCurrent();
      const configCurrent = this.base.layoutConfig[layoutConfigKeyCurrent];
      if (configCurrent) return configCurrent;
      // from config
      const configViewSize = this.$meta.util.getProperty(this.base.config, 'render.item.info.layout.viewSize');
      let layouts = configViewSize[this.container.mode][this.$view.size];
      if (!Array.isArray(layouts)) {
        layouts = [layouts];
      }
      return layouts[0].name;
    },
    layout_prepareConfigLayout(layoutCurrent) {
      // current
      this.layout.current = layoutCurrent || this.container.layout || this.layout_getDefault();
      // layoutConfig
      let config = this.$meta.util.getProperty(this.base.config, `render.item.layouts.${this.layout.current}`);
      if (!config) {
        config = this.$meta.util.getProperty(this.base.config, 'render.item.layouts.default');
      }
      if (!config) return false;
      const configBase = this.$meta.util.getProperty(this.base.config, 'render.item.layouts.base');
      this.layout.config = configBase ? this.$meta.util.extend({}, configBase, config) : config;
      return true;
    },
    async layout_switchLayout(layoutCurrent) {
      if (layoutCurrent === this.layout.current) return true;
      // force clear status
      this.layout.current = null;
      this.layout.config = null;
      // this.layout.instance = null;
      this.subnavbar.enable = false;
      this.subnavbar.render = false;
      // prepare
      if (!this.layout_prepareConfigLayout(layoutCurrent)) {
        return false;
      }
      // save
      const layoutConfigKeyCurrent = this.base_getLayoutConfigKeyCurrent();
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
      return (
        <eb-component
          module={this.layout.config.component.module}
          name={this.layout.config.component.name}
          options={this.layout_getComponentOptions()}
        ></eb-component>
      );
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
      if (!blockConfig) {
        const errorMessage = `${this.$text('Block Not Found')}: ${blockName}`;
        return <div>{errorMessage}</div>;
      }
      if (!blockConfig.component) {
        const errorMessage = `${this.$text('Block Component Not Found')}: ${blockName}`;
        return <div>{errorMessage}</div>;
      }
      const blockOptions = this.layout_getBlockComponentOptions({ blockConfig });
      return (
        <eb-component
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
    layout_renderCaptionInit() {
      if (this.base.ready) return null;
      return (
        <f7-nav-title>
          <div>{this.page_title}</div>
        </f7-nav-title>
      );
    },
    layout_renderPage() {
      return (
        <eb-page withSubnavbar={this.subnavbar.enable}>
          <eb-navbar eb-back-link="Back">
            {this.layout_renderCaptionInit()}
            {this.layout_renderBlock({ blockName: 'caption' })}
            {this.layout_renderBlock({ blockName: 'title' })}
            {this.layout_renderSubnavbar()}
          </eb-navbar>
          {this.layout_renderLayout()}
        </eb-page>
      );
    },
  },
};
