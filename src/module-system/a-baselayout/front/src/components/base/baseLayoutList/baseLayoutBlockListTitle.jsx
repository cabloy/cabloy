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
        let domBulkActionsRight;
        if (this.layoutManager.bulk_renderActionsRight) {
          domBulkActionsRight = this.layoutManager.bulk_renderActionsRight();
        }
        let domBulkActionsLeftB;
        if (this.layoutManager.bulk_renderActionsLeftB) {
          domBulkActionsLeftB = this.layoutManager.bulk_renderActionsLeftB();
        }
        children.push(domBulkActionsRight);
        children.push(domBulkActionsLeftB);
      }
      let domOrder;
      if (this.layoutManager.order_renderAction) {
        domOrder = this.layoutManager.order_renderAction();
      }
      let domOrderPopover;
      if (this.layoutManager.order_renderPopover) {
        domOrderPopover = this.layoutManager.order_renderPopover();
      }
      let domFilter;
      if (this.layoutManager.filter_renderAction) {
        domFilter = this.layoutManager.filter_renderAction();
      }
      children.push(domOrder);
      children.push(domOrderPopover);
      children.push(domFilter);
      // ok
      return <f7-nav-right>{children}</f7-nav-right>;
    },
  },
  render() {
    return this._renderNavRight();
  },
};
