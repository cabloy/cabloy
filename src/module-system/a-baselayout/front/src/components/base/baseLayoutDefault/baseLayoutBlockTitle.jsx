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
  created() {},
  methods: {
    _renderNavRight() {
      const isFull = this.layoutManager.subnavbar.render && !this.layoutManager.subnavbar.enable;
      const children = [];
      // full
      if (isFull) {
        let domInfoActionsLeft;
        if (this.layoutManager.info_renderActionsLeft) {
          domInfoActionsLeft = this.layoutManager.info_renderActionsLeft();
        }
        let domInfoActionsRight;
        if (this.layoutManager.info_renderActionsRight) {
          domInfoActionsRight = this.layoutManager.info_renderActionsRight();
        }
        children.push(domInfoActionsLeft);
        children.push(domInfoActionsRight);
      }
      // normal
      let domActions;
      if (this.layoutManager.actions_render) {
        domActions = this.layoutManager.actions_render();
      }
      let domActionsPopover;
      if (this.layoutManager.actions_renderPopover) {
        domActionsPopover = this.layoutManager.actions_renderPopover();
      }
      children.push(domActions, domActionsPopover);
      // ok
      return <f7-nav-right class={{ 'atom-item-title-info-container': isFull }}>{children}</f7-nav-right>;
    },
  },
  render() {
    return this._renderNavRight();
  },
};
