import itemLayoutManager from '../../common/itemLayoutManager/index.jsx';
export default {
  meta: {
    size: 'small',
  },
  mixins: [itemLayoutManager],
  data() {
    const query = this.$f7route.query;
    const mode = query.mode;
    const flowTaskId = parseInt(query.flowTaskId || 0);
    const detailId = parseInt(query.detailId || 0);
    const detailItemId = parseInt(query.detailItemId || 0);
    const layout = query.layout;
    return {
      container: {
        mode,
        flowTaskId,
        detailId,
        detailItemId,
        layout,
      },
    };
  },
  render() {
    return (
      <eb-page withSubnavbar={this.subnavbar.enable}>
        <eb-navbar title={this.page_getTitle()} subtitle={this.page_getSubtitle()} eb-back-link="Back">
          {this.layout_renderBlock({ blockName: 'title' })}
          {this.layout.instance && this.subnavbar.enable && this.layout_renderBlock({ blockName: 'subnavbar' })}
        </eb-navbar>
        {this.layout_renderLayout()}
      </eb-page>
    );
  },
};
