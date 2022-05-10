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
    return this.layout_renderPage();
  },
};
