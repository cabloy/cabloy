import appMenuLayoutManager from '../common/appMenuLayoutManager/index.jsx';
export default {
  mixins: [appMenuLayoutManager],
  data() {
    const query = this.$f7route.query;
    const appKey = query.appKey;
    const layout = query.layout;
    return {
      container: {
        appKey,
        layout,
      },
    };
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.$text('Demo')} eb-back-link="Back"></eb-navbar>
        <f7-block-title medium></f7-block-title>
        <f7-block strong>{this.container.appKey} </f7-block>
      </eb-page>
    );
  },
};
