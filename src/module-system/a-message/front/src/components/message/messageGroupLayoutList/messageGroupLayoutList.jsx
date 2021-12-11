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
    this.init();
  },
  beforeDestroy() {
    this.layoutManager.layout_clearInstance(this);
  },
  methods: {
    async init() {
      // instance
      await this.layoutManager.layout_setInstance(this);
      await this.onLoad();
    },
    async onLoad() {
      // params
      const params = this.layoutManager.base_prepareSelectParams();
      // fetch
      this.items = await this.$api.post('/a/message/message/group', params);
    },
    getItems() {
      return this.items;
    },
  },
  render() {
    return <div>{this.layoutManager.layout_renderBlock({ blockName: 'items' })}</div>;
  },
};
