export default {
  props: {
    layoutManager: {
      type: Object,
    },
  },
  data() {
    return {
      inited: false,
      info: {
        pageCurrent: 0,
        pageSize: 20,
        total: 0,
      },
      itemsPages: {},
      loading: false,
    };
  },
  computed: {
    itemKey() {
      return this.layoutManager.data.provider.itemKey;
    },
    dataSource() {
      return this.itemsPages[this.info.pageCurrent];
    },
  },
  methods: {
    async switch(options) {
      // only inited once
      if (this.inited) return;
      // inited
      this.inited = true;
      // init
      if (options.autoInit) {
        this.onPageRefresh();
      }
    },
    onPageRefresh() {
      this.onPageClear();
      return this._loadTotal();
    },
    onPageInfinite() {
      // do nothing
    },
    onPageClear() {
      // items
      this.loading = false;
      this.itemsPages = {};
      this.info = {
        pageCurrent: 0,
        pageSize: 20,
        total: 0,
      };
      this._changePageCurrent(0);
    },
    getItems() {
      return this.dataSource || [];
    },
    getLoading() {
      return this.loading;
    },
    getPageInfo() {
      return this.info;
    },
    findItem(key) {
      for (const pageNum in this.itemsPages) {
        const items = this.itemsPages[pageNum];
        const index = items.findIndex(item => item[this.itemKey] === key);
        const item = index === -1 ? null : items[index];
        if (index !== -1) {
          return {
            pageNum: parseInt(pageNum),
            items,
            index,
            item,
          };
        }
      }
      return { pageNum: null, items: null, index: -1, item: null };
    },
    spliceItem(bundle, howmany, ...args) {
      if (howmany === undefined) howmany = 1;
      this.info.total -= howmany - args.length;
      return bundle.items.splice(bundle.index, howmany, ...args);
    },
    replaceItem(bundle, itemNew) {
      this.$set(bundle.items, bundle.index, itemNew);
    },
    renderLoadMore() {
      return null;
    },
    gotoPage(pageNum) {
      // check if same
      if (this.info.pageCurrent === pageNum) return;
      const items = this.itemsPages[pageNum];
      if (items) {
        this._changePageCurrent(pageNum);
        return;
      }
      // fetch
      const index = (pageNum - 1) * this.info.pageSize;
      this.loading = true;
      this._loadMore({ index, size: this.info.pageSize })
        .then(items => {
          this.loading = false;
          this.$set(this.itemsPages, pageNum, items);
          this._changePageCurrent(pageNum);
        })
        .catch(err => {
          this.loading = false;
          this.layoutManager.$view.toast.show({ text: err.message });
        });
    },
    async _loadTotal() {
      this.loading = true;
      try {
        // fetch
        const res = await this.layoutManager.data_provider_onLoadItemsCount();
        this.loading = false;
        this.info.total = res;
        if (this.info.total === 0) return;
        // page 1, not await
        this.gotoPage(1);
      } catch (err) {
        this.layoutManager.$view.toast.show({ text: err.message });
        this.loading = false;
      }
    },
    async _loadMore({ index, size }) {
      // fetch
      const page = { index, size };
      const res = await this.layoutManager.data_provider_onLoadItemsPage({ page });
      return res.list;
    },
    _changePageCurrent(pageNum) {
      // page current
      this.info.pageCurrent = pageNum;
      // callback
      if (this.layoutManager.data_provider_onPageCurrentChanged) {
        this.layoutManager.data_provider_onPageCurrentChanged(this.info);
      }
      // event
      this.layoutManager.$emit('providerPaged:pageCurrentChanged', this.info);
    },
  },
};
