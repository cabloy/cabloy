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
    this.layoutManager.layout.instance = this;
    this.loadDetails();
  },
  methods: {
    async loadDetails() {
      // params
      const params = this.layoutManager.base_prepareSelectParams();
      // fetch
      const res = await this.$api.post('/a/detail/detail/select', params);
      this.items = res.list;
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
    getItemsAll() {
      return this.getItems();
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
        {this._renderBlock({ blockName: 'title' })}
        {this._renderBlock({ blockName: 'items' })}
      </div>
    );
  },
};

