import ebAtomClasses from '../../common/atomClasses.js';
import listLayoutManager from '../../common/listLayoutManager.jsx';
export default {
  mixins: [ ebAtomClasses, listLayoutManager ],
  data() {
    const query = this.$f7route.query;
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    const atomClass = (module && atomClassName) ? { module, atomClassName } : null;
    const options = (query && query.options) ? JSON.parse(query.options) : null;
    return {
      atomClass,
      options,
      scene: 'search',
      layout: 'list',
    };
  },
  computed: {
    pageTitle() {
      const atomClassTitle = this.atomClassTitle || this.$text('Atom');
      return `${this.$text('Search')} ${atomClassTitle}`;
    },
    atomClassTitle() {
      if (!this.atomClass) return '';
      if (this.atomClass.title) return this.atomClass.title;
      const _atomClass = this.getAtomClass(this.atomClass);
      if (!_atomClass) return '';
      return _atomClass.titleLocale;
    },
  },
  render() {
    return (
      <eb-search-page advanced title={this.pageTitle} advancedSearchTitle="Advanced Filter" onSearch={this.onSearch} onLoadMore={this.onPageInfinite} onDisable={this.onSearchDisable} onSearchAdvanced={this.onSearchAdvanced}>
        {this._renderLayoutComponent()}
      </eb-search-page>
    );
  },
};
