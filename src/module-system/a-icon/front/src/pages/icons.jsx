export default {
  data() {
    return {};
  },
  computed: {
    pageTitle() {
      return this.$text('Icons');
    },
  },
  created() {
    this.onSearchbarSearch = this.$meta.util.debounce((searchbar, query) => {
      this._onSearch(query);
    }, 300);
  },
  methods: {
    onClickEnable() {
      this.$refs.searchbar.f7Searchbar.enable(true);
    },
    _onSearch(query) {
      console.log(query);
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.pageTitle} eb-back-link="Back">
          <f7-nav-right>
            <f7-link icon-material="search" onClick={this.onClickEnable}></f7-link>
          </f7-nav-right>
          <f7-searchbar
            ref="searchbar"
            onSearchbarSearch={this.onSearchbarSearch}
            expandable
            search-container=".search-list"
            search-in=".item-title"
            placeholder={this.pageTitle}
            backdrop={false}
            disable-button={true}
            clear-button={true}
            custom-search={true}
          ></f7-searchbar>
        </eb-navbar>
      </eb-page>
    );
  },
};
