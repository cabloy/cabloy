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
      items: [],
    };
  },
  created() {
    // eslint-disable-next-line
    this.layoutManager.layout.instance = this;
    this.onLoad();
  },
  beforeDestroy() {
    // eslint-disable-next-line
    this.layoutManager.layout.instance = null;
  },
  methods: {
    async onLoad() {
      // params
      const params = this.layoutManager.base_prepareSelectParams();
      // fetch
      this.items = await this.$api.post('/a/message/message/group', params);
    },
    getBlockComponentOptions({ blockConfig }) {
      return {
        props: {
          layoutManager: this.layoutManager,
          layout: this,
          blockConfig,
        },
      };
    },
    getItems() {
      return this.items;
    },
    _renderBlock({ blockName }) {
      const blockConfig = this.layoutConfig.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
  },
  render() {
    return <div>{this._renderBlock({ blockName: 'items' })}</div>;
  },
};
