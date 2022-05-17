export default {
  data() {
    return {
      bulk: {},
    };
  },
  methods: {
    bulk_renderActionsNormalDefault() {
      const children = [];
      let domOrder;
      if (this.order_renderAction) {
        domOrder = this.order_renderAction();
      }
      let domOrderPopover;
      if (this.order_renderPopover) {
        domOrderPopover = this.order_renderPopover();
      }
      let domFilter;
      if (this.filter_renderAction) {
        domFilter = this.filter_renderAction();
      }
      children.push(domOrder);
      children.push(domOrderPopover);
      children.push(domFilter);
      return children;
    },
    bulk_renderActionsNormal() {
      return this.bulk_renderActionsNormalDefault();
    },
    bulk_renderActionsNormalPopover() {
      return null;
    },
  },
};
