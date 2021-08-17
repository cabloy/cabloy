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
    return {};
  },
  created() {
    // eslint-disable-next-line
    this.layoutManager.layout.instance = this;
    // eslint-disable-next-line
    this.layoutManager.subnavbar.enable = true;
  },
  beforeDestroy() {
    // eslint-disable-next-line
    this.layoutManager.layout.instance = null;
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
    return <div>{this._renderBlock({ blockName: 'main' })}</div>;
  },
};
