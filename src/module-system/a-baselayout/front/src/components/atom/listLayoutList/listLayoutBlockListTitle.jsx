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
      return (
        <f7-nav-right>
          {this.layoutManager.order_renderAction()}
          {this.layoutManager.filter_renderAction()}
        </f7-nav-right>
      );
    },
    _renderFull() {
      return (
        <f7-nav-right>
          {this.layoutManager.bulk_renderActionsRight()}
          {this.layoutManager.bulk_renderActionsLeftB()}
          {this.layoutManager.order_renderAction()}
          {this.layoutManager.filter_renderAction()}
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
