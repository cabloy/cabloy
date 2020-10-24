import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
import listLayoutManager from '../../common/listLayoutManager/index.jsx';
export default {
  mixins: [ ebPageContext, listLayoutManager ],
  data() {
    return {
      container: {
        atomClass: null,
        options: null,
        params: null,
        scene: 'selecting',
        layout: 'selecting',
      },
    };
  },
  created() {
    // pageContext
    const contextParams = this.contextParams;
    // atomClass
    this.container.atomClass = contextParams.atomClass;
    // options
    this.container.options = contextParams.options;
    // params
    this.container.params = contextParams.params;
  },
  render() {
    return (
      <eb-page
        ptr onPtrRefresh={this.onPageRefresh}
        infinite infinitePreloader={false} onInfinite={this.onPageInfinite}>
        <eb-navbar title={this.getPageTitle()} subtitle={this.getPageSubtitle()} eb-back-link="Back">
          {this.layout_renderBlock({ blockName: 'title' })}
        </eb-navbar>
        {this.layout_renderLayout()}
      </eb-page>
    );
  },
};
