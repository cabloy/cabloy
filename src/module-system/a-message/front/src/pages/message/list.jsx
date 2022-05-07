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
    return this.layout_renderPage();
  },
};
