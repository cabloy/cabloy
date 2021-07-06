import resourceTreeLayoutManager from '../../common/resourceTreeLayoutManager/index.jsx';
export default {
  mixins: [resourceTreeLayoutManager],
  data() {
    const query = this.$f7route.query;
    const maxLevelAutoOpened = parseInt(query.maxLevelAutoOpened || 1);
    let resourceType = query.resourceType;
    let home = false;
    if (!resourceType) {
      resourceType = 'a-base:menu';
      home = true;
    }
    // layout
    const layout = query && query.layout;
    return {
      container: {
        maxLevelAutoOpened,
        resourceType,
        home,
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
