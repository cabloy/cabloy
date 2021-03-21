import Antdv from '../../../common/antdv.jsx';

export default {
  meta: {
    global: false,
  },
  mixins: [ Antdv ],
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
      info: {
        pageCurrent: 1,
        pageSize: 20,
        total: 0,
      },
      itemsPages: {},
      loading: false,
    };
  },
  computed: {
    dataSource() {
      return this.itemsPages[this.info.pageCurrent];
    },
  },
  created() {
    this.layoutManager.layout.instance = this;
    this.loadDetails();
  },
  methods: {
    async loadDetails() {
      try {
        this.loading = true;
        // params
        const params = this.layoutManager.base_prepareSelectParams();
        // fetch
        const res = await this.$api.post('/a/detail/detail/select', params);
        const items = res.list;
        this.$set(this.itemsPages, this.info.pageCurrent, items);
        this.info.pageSize = this.info.total = items.length;
        this.loading = false;
      } catch (err) {
        this.$view.toast.show({ text: err.message });
        this.loading = false;
      }
    },
    getItems() {
      return this.dataSource || [];
    },
    getItemsAll() {
      return this.getItems();
    },
    _findItem(detailId) {
      for (const pageNum in this.itemsPages) {
        const items = this.itemsPages[pageNum];
        const index = items.findIndex(item => item.detailId === detailId);
        if (index !== -1) {
          return {
            pageNum: parseInt(pageNum),
            items,
            index,
          };
        }
      }
      return { pageNum: null, items: null, index: -1 };
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
    _renderBlock({ blockName }) {
      const blockConfig = this.layoutConfig.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
    _renderEmpty() {
      if (this.loading) return (<f7-preloader></f7-preloader>);
      return (<div>{this.$text('No Data')}</div>);
    },
    _renderConfigProvider() {
      if (!this.antdv.locales) return null;
      return (
        <a-config-provider locale={this.antdv_getLocale()} renderEmpty={this._renderEmpty}>
          { this._renderBlock({ blockName: 'items' })}
        </a-config-provider>
      );
    },
  },
  render() {
    return (
      <div class="eb-antdv">
        {this._renderBlock({ blockName: 'title' })}
        {this._renderConfigProvider()}
      </div>
    );
  },
};
