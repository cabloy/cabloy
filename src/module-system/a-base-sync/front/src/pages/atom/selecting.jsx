import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
import listLayoutManager from '../../common/listLayoutManager.jsx';
export default {
  mixins: [ ebPageContext, listLayoutManager ],
  data() {
    return {
      atomClass: null,
      options: null,
      params: null,
      scene: 'selecting',
      layout: 'selecting',
    };
  },
  created() {
    // pageContext
    const contextParams = this.contextParams;
    // atomClass
    this.atomClass = contextParams.atomClass;
    // options
    this.options = contextParams.options;
    // params
    this.params = contextParams.params;
  },
  render() {
    return (
      <eb-page
        ptr onPtrRefresh={this.onPageRefresh}
        infinite infinitePreloader={false} onInfinite={this.onPageInfinite}>
        <eb-navbar title={this.getPageTitle()} subtitle={this.getPageSubtitle()} eb-back-link="Back">
          {this._renderBlock({ blockName: 'title' })}
        </eb-navbar>
        {this._renderLayout()}
      </eb-page>
    );
  },
};
