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
    _renderNormal() {
      let domOrder;
      if (this.layoutManager.order_renderAction) {
        domOrder = this.layoutManager.order_renderAction();
      }
      let domFilter;
      if (this.layoutManager.filter_renderAction) {
        domFilter = this.layoutManager.filter_renderAction();
      }
      return (
        <f7-nav-right>
          {domOrder}
          {domFilter}
        </f7-nav-right>
      );
    },
    _renderFull() {
      let domBulkActionsRight;
      if (this.layoutManager.bulk_renderActionsRight) {
        domBulkActionsRight = this.layoutManager.bulk_renderActionsRight();
      }
      let domBulkActionsLeftB;
      if (this.layoutManager.bulk_renderActionsLeftB) {
        domBulkActionsLeftB = this.layoutManager.bulk_renderActionsLeftB();
      }
      let domOrder;
      if (this.layoutManager.order_renderAction) {
        domOrder = this.layoutManager.order_renderAction();
      }
      let domFilter;
      if (this.layoutManager.filter_renderAction) {
        domFilter = this.layoutManager.filter_renderAction();
      }
      return (
        <f7-nav-right>
          {domBulkActionsRight}
          {domBulkActionsLeftB}
          {domOrder}
          {domFilter}
        </f7-nav-right>
      );
    },
  },
  render() {
    let domNavRight;
    if (this.layoutManager.subnavbar.render && !this.layoutManager.subnavbar.enable) {
      domNavRight = this._renderFull();
    } else {
      domNavRight = this._renderNormal();
    }
    return domNavRight;
  },
};
