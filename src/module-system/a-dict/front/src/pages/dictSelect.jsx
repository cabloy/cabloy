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
    dict() {
      return this.contextParams.dict;
    },
    leafOnly() {
      return this.contextParams.leafOnly;
    },
    selectedCodes() {
      return this.contextParams.selectedCodes;
    },
  },
  methods: {
    onSearch(query) {
      console.log(query);
    },
    onDisable() {
      this.$f7router.back();
    },
    onNodeChange(node) {
      this.contextCallback(200, node);
      this.$f7router.back();
    },
  },
  render() {
    return (
      <eb-search-page title={this.title} onSearch={this.onSearch} onDisable={this.onDisable}>
        <dictSelect
          ref="tree"
          dict={this.dict}
          leafOnly={this.leafOnly}
          selectedCodes={this.selectedCodes}
          onNodeChange={this.onNodeChange}
        ></dictSelect>
      </eb-search-page>
    );
  },
};
