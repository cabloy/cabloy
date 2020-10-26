export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layoutConfig: {
      type: Object,
    },
  },
  data() {
    return {
      antdvLocales: null,
      itemsPages: {},
    };
  },
  created() {
    // locales
    const action = {
      actionModule: 'a-antdv',
      actionComponent: 'antdv',
      name: 'locales',
    };
    this.$meta.util.performAction({ ctx: this, action }).then(locales => {
      this.antdvLocales = locales;
    });
    //
    if (this.layoutManager.container.atomClass && (this.layoutManager.container.scene !== 'select' && this.layoutManager.container.scene !== 'selecting')) {
      this.layoutManager.bottombar.enable = true;
      this.layoutManager.bulk_loadActions();
    }
  },
  methods: {
    getBlockComponentOptions({ blockConfig }) {
      return {
        props: {
          layoutManager: this.layoutManager,
          layout: this,
          blockConfig,
        },
      };
    },
    _getAntdvLocale() {
      if (!this.antdvLocales) return null;
      const locale = this.$meta.util.getLocale();
      if (!locale || locale === 'en-us') return null;
      return this.antdvLocales[locale];
    },
    _renderBlock({ blockName }) {
      const blockConfig = this.layoutConfig.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
    _renderConfigProvider() {
      if (!this.antdvLocales) return null;
      return (
        <a-config-provider locale={this._getAntdvLocale()}>
          { this._renderBlock({ blockName: 'items' })}
        </a-config-provider>
      );
    },
  },
  render() {
    return (
      <div>
        {this._renderConfigProvider()}
      </div>
    );
  },
};
