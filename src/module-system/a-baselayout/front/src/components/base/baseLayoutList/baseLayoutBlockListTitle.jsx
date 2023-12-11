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
    _isFull() {
      const container = this.layoutManager.container;
      return container.atomClass && container.scene !== 'select' && container.scene !== 'selecting';
    },
    _renderNavRight() {
      // const isFull = this.layoutManager.subnavbar.render && !this.layoutManager.subnavbar.enable;
      const isFull = this._isFull();
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
      // normal
      let domActions;
      if (this.layoutManager.bulk_renderActionsNormal) {
        domActions = this.layoutManager.bulk_renderActionsNormal();
      }
      let domActionsPopover;
      if (this.layoutManager.bulk_renderActionsNormalPopover) {
        domActionsPopover = this.layoutManager.bulk_renderActionsNormalPopover();
      }
      children.push(domActions, domActionsPopover);
      // ok
      return <f7-nav-right>{children}</f7-nav-right>;
    },
  },
  render() {
    return this._renderNavRight();
  },
};
