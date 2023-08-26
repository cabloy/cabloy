import itemLayoutManager from '../../common/itemLayoutManager/index.jsx';
export default {
  meta: {
    size: 'medium',
  },
  mixins: [itemLayoutManager],
  data() {
    const query = this.$f7route.query;
    const mode = query.mode;
    const atomId = this.$meta.util.parseIdSafe(query.atomId);
    const itemId = this.$meta.util.parseIdSafe(query.itemId);
    const layout = query.layout;
    const module = query.module;
    const atomClassName = query.atomClassName;
    const atomClass = module && atomClassName ? { module, atomClassName } : null;
    const options = query.options ? JSON.parse(query.options) : {};
    const params = query.params ? JSON.parse(query.params) : {};
    // atomMain
    const atomMain = this.$f7route.context?.params?.atomMain;
    if (atomMain) {
      options.atomMain = atomMain;
    }
    // flowTaskId
    if (query.flowTaskId) {
      options.flowTaskId = parseInt(query.flowTaskId);
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
