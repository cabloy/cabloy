import flowLayoutManager from '../common/flowLayoutManager/index.jsx';
export default {
  mixins: [flowLayoutManager],
  data() {
    const query = this.$f7route.query;
    const flowId = parseInt(query.flowId || 0);
    const flowTaskId = parseInt(query.flowTaskId || 0);
    const layout = query.layout;
    return {
      container: {
        flowId,
        flowTaskId,
        layout,
      },
    };
  },
  render() {
    return (
      <eb-page withSubnavbar={this.subnavbar.enable} ptr onPtrRefresh={this.page_onRefresh}>
        <eb-navbar title={this.page_getTitle()} subtitle={this.page_getSubtitle()} eb-back-link="Back">
          {this.layout_renderBlock({ blockName: 'title' })}
          {this.layout.instance && this.subnavbar.enable && this.layout_renderBlock({ blockName: 'subnavbar' })}
        </eb-navbar>
        {this.layout_renderLayout()}
      </eb-page>
    );
  },
};
