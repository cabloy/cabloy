export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    _renderActionsLeft() {
      let domBulkActionsLeft;
      if (this.layoutManager.bulk_renderActionsLeft) {
        domBulkActionsLeft = this.layoutManager.bulk_renderActionsLeft();
      }
      return <div class="actions-block actions-block-left">{domBulkActionsLeft}</div>;
    },
    _renderActionsRight() {
      let domBulkActionsRight;
      if (this.layoutManager.bulk_renderActionsRight) {
        domBulkActionsRight = this.layoutManager.bulk_renderActionsRight();
      }
      return <div class="actions-block actions-block-right">{domBulkActionsRight}</div>;
    },
  },
  render() {
    return (
      <f7-subnavbar>
        <div>ssss</div>
        <div class="atom-list-subnavbar-container">
          {this._renderActionsLeft()}
          {this._renderActionsRight()}
        </div>
      </f7-subnavbar>
    );
  },
};
