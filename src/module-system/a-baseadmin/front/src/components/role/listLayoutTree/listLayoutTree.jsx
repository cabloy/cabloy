import TreeviewAdapterFn from './treeviewAdapter.js';

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
      treeviewData: null,
    };
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.treeviewData = null;
    this.layoutManager.layout_clearInstance(this);
  },
  methods: {
    async init() {
      // subnavbar
      // eslint-disable-next-line
      this.layoutManager.subnavbar.enable = false;
      // eslint-disable-next-line
      this.layoutManager.subnavbar.render = false;
      // provider switch
      const res = await this.layoutManager.data_providerSwitch({
        providerName: 'tree',
        autoInit: true,
        treeviewAdapter: TreeviewAdapterFn(this),
        treeviewRoot: {
          attrs: {
            itemToggle: false,
            selectable: true,
          },
        },
      });
      this.treeviewData = res.treeviewData;
      // instance
      await this.layoutManager.layout_setInstance(this);
    },
  },
  render() {
    return <div>{this.layoutManager.layout_renderBlock({ blockName: 'items' })}</div>;
  },
};
