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
    // resource
    this.container.resource = contextParams.resource;
  },
  render() {
    return this.layout_renderPage();
  },
};
