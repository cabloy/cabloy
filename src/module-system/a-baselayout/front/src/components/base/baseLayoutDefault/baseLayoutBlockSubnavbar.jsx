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
      let domInfoActionsLeft;
      if (this.layoutManager.info_renderActionsLeft) {
        domInfoActionsLeft = this.layoutManager.info_renderActionsLeft();
      }
      return <div class="actions-block actions-block-left eb-scrollable">{domInfoActionsLeft}</div>;
    },
    _renderActionsRight() {
      let domInfoActionsRight;
      if (this.layoutManager.info_renderActionsRight) {
        domInfoActionsRight = this.layoutManager.info_renderActionsRight();
      }
      return <div class="actions-block actions-block-right">{domInfoActionsRight}</div>;
    },
  },
  render() {
    return (
      <f7-subnavbar>
        <div class="atom-item-subnavbar-container">
          {this._renderActionsLeft()}
          {this._renderActionsRight()}
        </div>
      </f7-subnavbar>
    );
  },
};
