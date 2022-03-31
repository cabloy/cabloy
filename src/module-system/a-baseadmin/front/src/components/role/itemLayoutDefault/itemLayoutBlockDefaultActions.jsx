export default {
  data() {
    return {};
  },
  methods: {
    _renderActionsLeft() {
      const children = this.layoutManager.info_renderActionsLeft();
      return <div class="actions-block actions-block-left">{children}</div>;
    },
    _renderActionsRight() {
      const children = this.layoutManager.info_renderActionsRight();
      return <div class="actions-block actions-block-right">{children}</div>;
    },
  },
};
