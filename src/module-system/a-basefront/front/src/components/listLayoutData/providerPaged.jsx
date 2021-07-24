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
      this.layoutManager.bulk.selectedAtoms = [];
      // items
      this.itemsPages = {};
      this.info = {
        pageCurrent: 0,
        pageSize: 20,
        total: 0,
      };
      this.loading = false;
    },
    getItems() {
      return this.dataSource || [];
    },
    findItem(atomId) {
      for (const pageNum in this.itemsPages) {
        const items = this.itemsPages[pageNum];
        const index = items.findIndex(item => item.atomId === atomId);
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
  },
};
