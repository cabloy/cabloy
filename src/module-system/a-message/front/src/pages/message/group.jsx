import messageGroupLayoutManager from '../../common/messageGroupLayoutManager/index.jsx';
export default {
  mixins: [messageGroupLayoutManager],
  data() {
    return {
      container: {},
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
