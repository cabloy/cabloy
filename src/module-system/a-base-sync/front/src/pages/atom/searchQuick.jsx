import ebAtomClasses from '../../common/atomClasses.js';
import listLayoutManager from '../../common/listLayoutManager/index.jsx';
export default {
  mixins: [ ebAtomClasses, listLayoutManager ],
  data() {
    const query = this.$f7route.query;
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    const atomClass = (module && atomClassName) ? { module, atomClassName } : null;
    const options = (query && query.options) ? JSON.parse(query.options) : null;
    return {
      container: {
        atomClass,
        options,
        scene: 'search',
        layout: 'list',
      },
    };
  },
  render() {
    return (
      <eb-search-page advanced title={this.getPageTitle()} subtitle={this.getPageSubtitle()} advancedSearchTitle="Advanced Filter" onSearch={this.search_onSearch} onLoadMore={this.onPageInfinite} onDisable={this.search_onSearchDisable} onSearchAdvanced={this.search_onSearchAdvanced}>
        {this.layout_renderComponent()}
      </eb-search-page>
    );
  },
};
