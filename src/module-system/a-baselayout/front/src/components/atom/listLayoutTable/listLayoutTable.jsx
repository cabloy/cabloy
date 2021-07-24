import Antdv from '../../../common/antdv.jsx';

export default {
  meta: {
    global: false,
  },
  mixins: [Antdv],
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
    this.init();
  },
  beforeDestroy() {
    // eslint-disable-next-line
    this.layoutManager.layout.instance = null;
  },
  methods: {
    async init() {
      // eslint-disable-next-line
      this.layoutManager.layout.instance = this;
      // eslint-disable-next-line
      this.layoutManager.bottombar.enable = true;
      // provider switch
      await this.layoutManager.data_providerSwitch({
        providerName: 'paged',
        autoInit: true,
      });
    },
    _loadTotal() {
      // params
      const params = this.layoutManager.base_prepareSelectParams();
      // fetch
      this.loading = true;
      this.$api
        .post('/a/base/atom/count', params)
        .then(res => {
          this.loading = false;
          this.info.total = res;
          if (this.info.total === 0) return;
          // page 1
          this.gotoPage(1);
        })
        .catch(err => {
          this.$view.toast.show({ text: err.message });
          this.loading = false;
        });
    },
    async _loadMore({ index, size }) {
      // params
      const params = this.layoutManager.base_prepareSelectParams();
      // index
      params.options.page = { index, size };
      // fetch
      const res = await this.$api.post('/a/base/atom/select', params);
      return res.list;
    },
    gotoPage(pageNum) {
      if (this.info.pageCurrent === pageNum) return;
      this.layoutManager.bulk.selectedAtoms = [];
      const items = this.itemsPages[pageNum];
      if (items) {
        this.info.pageCurrent = pageNum;
        return;
      }
      // fetech
      const index = (pageNum - 1) * this.info.pageSize;
      this.loading = true;
      this._loadMore({ index, size: this.info.pageSize })
        .then(items => {
          this.$set(this.itemsPages, pageNum, items);
          this.info.pageCurrent = pageNum;
          this.loading = false;
        })
        .catch(err => {
          this.$view.toast.show({ text: err.message });
          this.loading = false;
        });
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
      if (this.loading) return <f7-preloader></f7-preloader>;
      return <div>{this.$text('No Data')}</div>;
    },
    _renderConfigProvider() {
      if (!this.antdv.locales) return null;
      return (
        <a-config-provider locale={this.antdv_getLocale()} renderEmpty={this._renderEmpty}>
          {this._renderBlock({ blockName: 'items' })}
        </a-config-provider>
      );
    },
  },
  render() {
    return <div class="eb-antdv">{this._renderConfigProvider()}</div>;
  },
};
