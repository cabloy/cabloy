import itemLayoutManager from '../../common/itemLayoutManager/index.jsx';
export default {
  meta: {
    size: 'medium',
  },
  mixins: [ itemLayoutManager ],
  data() {
    const query = this.$f7route.query;
    const mode = query.mode;
    const atomId = parseInt(query.atomId || 0);
    const itemId = parseInt(query.itemId || 0);
    const atomClassId = parseInt(query.atomClassId || 0);
    return {
      container: {
        mode,
        atomId,
        itemId,
        atomClassId,
      },
    };
  },
  render() {
    return (
      <eb-page>
      </eb-page>
    );
  },
};
