import listLayoutManager from '../../common/listLayoutManager.jsx';
export default {
  mixins: [ listLayoutManager ],
  data() {
    const query = this.$f7route.query;
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    const atomClass = (module && atomClassName) ? { module, atomClassName } : null;
    const options = (query && query.options) ? JSON.parse(query.options) : null;
    const params = (query && query.params) ? JSON.parse(query.params) : null;
    const scene = query && query.scene;
    const layout = query && query.layout;
    return {
      atomClass,
      options,
      params,
      scene, // default/search
      layout,
    };
  },
  render() {
    return (
      <eb-page ptr onPtrRefresh={this.onPageRefresh} infinite infinitePreloader={false} onInfinite={this.onPageInfinite}>
        <eb-navbar title={this.getPageTitle()} eb-back-link="Back">
          {this._renderBlock({ blockName: 'title' })}
        </eb-navbar>
        {this._renderLayout()}
      </eb-page>
    );
  },
};
