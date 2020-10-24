export default {
  data() {
    return {
      search: {
        query: null,
      },
    };
  },
  methods: {
    search_onSearch(query) {
      this.search.query = query;
      if (this.search.query) {
        this.page_onRefresh();
      } else {
        this.page_onClear();
      }
    },
    search_onSearchDisable() {
      this.$f7router.back();
    },
    search_onSearchAdvanced() {
      this.filter_onPerform();
    },
  },
};
