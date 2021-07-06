import atomLayoutManager from '../common/atomLayoutManager/index.jsx';
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext, atomLayoutManager],
  data() {
    const query = this.$f7route.query;
    const flowTaskId = parseInt(query.flowTaskId || 0);
    const mode = query.mode; // edit/view
    const layout = query.layout;
    return {
      container: {
        flowTaskId,
        mode,
        layout,
      },
    };
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.page_getTitle()} subtitle={this.page_getSubtitle()} eb-back-link="Back">
          {this.layout_renderBlock({ blockName: 'title' })}
        </eb-navbar>
        {this.layout_renderLayout()}
      </eb-page>
    );
  },
};
