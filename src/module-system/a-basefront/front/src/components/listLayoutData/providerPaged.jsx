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
      this._loadTotal();
    },
    onPageInfinite() {
      // do nothing
    },
    onPageClear() {
      // eslint-disable-next-line
      this.layoutManager.bulk_clearSelectedAtoms();
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
    findItem(atomId) {
      for (const pageNum in this.itemsPages) {
        const items = this.itemsPages[pageNum];
        const index = items.findIndex(item => item.atomId === atomId);
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
    replaceItem(bundle, atomNew) {
      this.$set(bundle.items, bundle.index, atomNew);
    },
    gotoPage(pageNum) {
      // check if same
      if (this.info.pageCurrent === pageNum) return;
      // eslint-disable-next-line
      this.layoutManager.bulk_clearSelectedAtoms();
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
          this.layoutManager.$view.toast.show({ text: err.message });
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
    _changePageCurrent(pageNum) {
      this.info.pageCurrent = pageNum;
      this.layoutManager.$emit('providerPaged:pageCurrentChanged', { pageCurrent: pageNum });
    },
  },
};
