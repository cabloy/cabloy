import itemLayoutManager from '../../common/itemLayoutManager/index.jsx';
export default {
  meta: {
    size: 'medium',
  },
  mixins: [itemLayoutManager],
  data() {
    const query = this.$f7route.query;
    const mode = query.mode;
    const atomId = parseInt(query.atomId || 0);
    const itemId = parseInt(query.itemId || 0);
    const layout = query.layout;
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    const atomClass = module && atomClassName ? { module, atomClassName } : null;
    const options = query && query.options ? JSON.parse(query.options) : {};
    const params = query && query.params ? JSON.parse(query.params) : {};
    // atomMain
    const atomMain = this.$f7route.context?.params?.atomMain;
    if (atomMain) {
      options.atomMain = atomMain;
    }
    return {
      container: {
        mode,
        atomId,
        itemId,
        layout,
        atomClass,
        options,
        params,
      },
    };
  },
  render() {
    return this.layout_renderPage();
  },
};
