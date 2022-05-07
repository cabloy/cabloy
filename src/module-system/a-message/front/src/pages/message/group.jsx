import messageGroupLayoutManager from '../../common/messageGroupLayoutManager/index.jsx';
export default {
  mixins: [messageGroupLayoutManager],
  data() {
    return {
      container: {},
    };
  },
  render() {
    return this.layout_renderPage();
  },
};
