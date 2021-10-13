import messageListLayoutManager from '../../common/messageListLayoutManager/index.jsx';
export default {
  mixins: [messageListLayoutManager],
  data() {
    const query = this.$f7route.query;
    const messageClass = JSON.parse(query.messageClass);
    return {
      container: {
        messageClass,
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
