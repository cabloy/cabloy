import Vue from 'vue';
import dictSelect from '../components/dictSelect.jsx';
import dictFilterSheet from '../components/dictFilterSheet.jsx';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  components: {
    dictSelect,
    dictFilterSheet,
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
      this.$refs.sheet.search(query);
    },
    onFocus() {
      this.$refs.sheet.search(this.$refs.searchPage.query);
    },
    onDisable() {
      this.$f7router.back();
    },
    onDictItemClick(node) {
      this.contextCallback(200, node);
      this.$f7router.back();
    },
    onDictClearSelected() {
      this.onDictItemClick(null);
    },
    async onCodeMatchClick(codeMatch) {
      await this.$refs.tree.selectDictItem(codeMatch.code);
    },
  },
  render() {
    return (
      <eb-search-page
        ref="searchPage"
        title={this.title}
        onSearch={this.onSearch}
        onDisable={this.onDisable}
        onFocus={this.onFocus}
      >
        <dictSelect
          ref="tree"
          dict={this.dict}
          leafOnly={this.leafOnly}
          selectedCodes={this.selectedCodes}
          onDictItemClick={this.onDictItemClick}
          onDictClearSelected={this.onDictClearSelected}
        ></dictSelect>
        <dictFilterSheet ref="sheet" dict={this.dict} onCodeMatchClick={this.onCodeMatchClick}></dictFilterSheet>
      </eb-search-page>
    );
  },
};
