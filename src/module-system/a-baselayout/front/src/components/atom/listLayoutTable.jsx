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
      moduleAntdv: null,
      itemsPages: {},
    };
  },
  created() {
    this.$meta.module.use('a-antdv').then(module => {
      this.moduleAntdv = module;
    });
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
    _renderBlock({ blockName }) {
      const blockConfig = this.layoutConfig.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
  },
  render() {
    return (
      <div>
        { !!this.moduleAntdv && this._renderBlock({ blockName: 'items' })}
      </div>
    );
  },
};
