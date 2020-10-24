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
        scene: 'select',
        layout: 'select',
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
    const selectMode = contextParams.selectMode;
    // params
    let selectedAtomIds;
    if (contextParams.selectMode === 'single') {
      selectedAtomIds = contextParams.selectedAtomId ? [ contextParams.selectedAtomId ] : [];
    } else {
      selectedAtomIds = contextParams.selectedAtomIds ? contextParams.selectedAtomIds.concat() : [];
    }
    this.container.params = {
      selectMode,
      selectedAtomIds,
    };
  },
  render() {
    return (
      <eb-page
        ptr onPtrRefresh={this.onPageRefresh}
        infinite infinitePreloader={false} onInfinite={this.onPageInfinite}>
        <eb-navbar title={this.getPageTitle()} eb-back-link="Back">
          {this._renderBlock({ blockName: 'title' })}
        </eb-navbar>
        {this._renderLayout()}
      </eb-page>
    );
  },
};
