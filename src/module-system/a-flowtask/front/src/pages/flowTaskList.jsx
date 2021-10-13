import flowTaskListLayoutManager from '../common/flowTaskListLayoutManager/index.jsx';
export default {
  mixins: [flowTaskListLayoutManager],
  data() {
    const query = this.$f7route.query;
    const options = query && query.options ? JSON.parse(query.options) : { mode: 'history' };
    const layout = query && query.layout;
    return {
      container: {
        options,
        layout,
      },
    };
  },
  render() {
    return (
      <eb-page
        ptr
        onPtrRefresh={this.page_onRefresh}
        infinite
        infinitePreloader={false}
        onInfinite={this.page_onInfinite}
      >
        <eb-navbar title={this.page_getTitle()} subtitle={this.page_getSubtitle()} eb-back-link="Back">
          {this.layout_renderBlock({ blockName: 'title' })}
        </eb-navbar>
        {this.layout_renderLayout()}
      </eb-page>
    );
  },
};
