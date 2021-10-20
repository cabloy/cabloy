import Vue from 'vue';
import dictSelect from '../components/dictSelect.jsx';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  components: {
    dictSelect,
  },
  computed: {
    title() {
      return this.contextParams.title;
    },
  },
  methods: {
    onSearch(query) {
      this.$refs.list.onSearch(query);
    },
    onLoadMore() {
      this.$refs.list.loadMore();
    },
    onDisable() {
      this.$f7router.back();
    },
    onSelect(event, item) {
      this.contextCallback(200, item);
      this.$f7router.back();
    },
  },
  render() {
    return (
      <eb-search-page
        title={this.title}
        onSearch={this.onSearch}
        onLoadMore={this.onLoadMore}
        onDisable={this.onDisable}
      >
        <div>sssss</div>
      </eb-search-page>
    );
  },
};
