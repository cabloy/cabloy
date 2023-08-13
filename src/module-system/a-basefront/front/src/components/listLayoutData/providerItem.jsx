export default {
  props: {
    layoutManager: {
      type: Object,
    },
  },
  data() {
    return {
      inited: false,
      loading: false,
      item: null,
    };
  },
  computed: {
    dataSource() {
      return this.item;
    },
  },
  methods: {
    async switch(options) {
      // only inited once
      if (this.inited) return;
      // inited
      this.inited = true;
      // init: do nothing
    },
    onPageRefresh() {
      this.onPageClear();
      return this._loadItem();
    },
    onPageInfinite() {
      // do nothing
    },
    onPageClear() {
      this.loading = false;
    },
    getLoading() {
      return this.loading;
    },
    async _loadItem() {
      this.loading = true;
      try {
        // fetch
        const res = await this.layoutManager.data_provider_onLoadItem();
        this.loading = false;
        this.item = res;
      } catch (err) {
        this.layoutManager.$view.toast.show({ text: err.message });
        this.loading = false;
      }
    },
  },
};
