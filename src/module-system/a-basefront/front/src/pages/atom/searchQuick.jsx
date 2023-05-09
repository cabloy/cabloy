import Vue from 'vue';
import listLayoutManager from '../../common/listLayoutManager/index.jsx';
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
export default {
  mixins: [ebAtomClasses, listLayoutManager],
  data() {
    const query = this.$f7route.query;
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    const atomClass = module && atomClassName ? { module, atomClassName } : null;
    const options = query && query.options ? JSON.parse(query.options) : {};
    const params = query && query.params ? JSON.parse(query.params) : {};
    return {
      container: {
        atomClass,
        options,
        params,
        scene: 'search',
        layout: 'list',
      },
    };
  },
  render() {
    return (
      <eb-search-page
        advanced
        title={this.page_getTitle()}
        subtitle={this.page_getSubtitle()}
        advancedSearchTitle="Advanced Filter"
        onSearch={this.search_onSearch}
        onLoadMore={this.page_onInfinite}
        onDisable={this.search_onSearchDisable}
        onSearchAdvanced={this.search_onSearchAdvanced}
      >
        {this.layout_renderComponent()}
      </eb-search-page>
    );
  },
};
