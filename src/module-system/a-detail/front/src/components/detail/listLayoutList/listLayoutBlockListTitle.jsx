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
    return {
    };
  },
  methods: {
    _renderActionsLeft() {
      const title = this.layoutManager.container.title;
      return (
        <div class="actions-block actions-block-left">{title}</div>
      );
    },
    _renderActionsRight() {
      const children = this.layoutManager.bulk_renderActionsRight();
      return (
        <div class="actions-block actions-block-right">
          {children}
        </div>
      );
    },
  },
  render() {
    return (
      <f7-list-item groupTitle>
        <div class="detail-list-title-container">
          {this._renderActionsLeft()}
          {this._renderActionsRight()}
        </div>
      </f7-list-item>
    );
  },
};
