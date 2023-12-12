export default {
  methods: {
    _renderQuickFilter() {
      let domBulkActionsRight;
      if (this.layoutManager.bulk_renderActionsRight) {
        domBulkActionsRight = this.layoutManager.bulk_renderActionsRight();
      }
      return (
        <div class="actions-block actions-block-right actions-block-right-quick-filter">{domBulkActionsRight}</div>
      );
    },
  },
};
