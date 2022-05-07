import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
import listLayoutManager from '../../common/listLayoutManager/index.jsx';
export default {
  mixins: [ebPageContext, listLayoutManager],
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
      selectedAtomIds = contextParams.selectedAtomId ? [contextParams.selectedAtomId] : [];
    } else {
      selectedAtomIds = contextParams.selectedAtomIds ? contextParams.selectedAtomIds.concat() : [];
    }
    this.container.params = {
      selectMode,
      selectedAtomIds,
    };
    // special for selectMode=single
    if (contextParams.selectMode === 'single') {
      this.container.scene = 'selecting';
      this.container.layout = 'selecting';
    }
    // resource
    this.container.resource = contextParams.resource;
  },
  render() {
    return this.layout_renderPage();
  },
};
