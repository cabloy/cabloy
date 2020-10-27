import Antdv from '../../common/antdv.jsx';

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
  created() {
    if (this.layoutManager.container.atomClass && (this.layoutManager.container.scene !== 'select' && this.layoutManager.container.scene !== 'selecting')) {
      this.layoutManager.bottombar.enable = true;
      this.layoutManager.bulk_loadActions();
    }
    // first load
    this.onPageRefresh();
  },
  methods: {
    onPageRefresh(/* force*/) {
      this.onPageClear();
      this._loadTotal().then(() => {

      });
    },
    onPageInfinite() {
      // do nothing
    },
    onPageClear() {
      this.itemsPages = {};
      this.info = {
        pageCurrent: 1,
        pageSize: 20,
        total: 0,
      };
      this.loading = false;
    },
    async _loadTotal() {
      // params
      const params = this.layoutManager.base_prepareSelectParams();
      // fetch
      const res = await this.$api.post('/a/base/atom/count', params);
      this.info.total = res;
      if (this.info.total === 0) return;
      // page 1
      this.gotoPage(1);
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
      this.info.pageCurrent = pageNum;
      const items = this.itemsPages[pageNum];
      if (items) return items;
      // fetech
      const index = (pageNum - 1) * this.info.pageSize;
      this.loading = true;
      this._loadMore({ index, size: this.info.pageSize }).then(items => {
        this.itemsPages[pageNum] = items;
        this.loading = false;
      }).catch(err => {
        this.$view.toast.show({ text: err.message });
        this.loading = false;
      });
    },
    getDataSource() {
      return this.itemsPages[this.info.pageCurrent];
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
    _renderConfigProvider() {
      if (!this.antdv.locales) return null;
      return (
        <a-config-provider locale={this.antdv_getLocale()}>
          { this._renderBlock({ blockName: 'items' })}
        </a-config-provider>
      );
    },
  },
  render() {
    return (
      <div class="eb-antdv">
        {this._renderConfigProvider()}
      </div>
    );
  },
};
