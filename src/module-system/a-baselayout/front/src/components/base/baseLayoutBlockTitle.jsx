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
      let domActions;
      if (this.layoutManager.actions_render) {
        domActions = this.layoutManager.actions_render();
      }
      return <f7-nav-right>{domActions}</f7-nav-right>;
    },
    _renderFull() {
      let domInfoActionsLeft;
      if (this.layoutManager.info_renderActionsLeft) {
        domInfoActionsLeft = this.layoutManager.info_renderActionsLeft();
      }
      let domInfoActionsRight;
      if (this.layoutManager.info_renderActionsRight) {
        domInfoActionsRight = this.layoutManager.info_renderActionsRight();
      }
      let domActions;
      if (this.layoutManager.actions_render) {
        domActions = this.layoutManager.actions_render();
      }
      return (
        <f7-nav-right class="atom-item-title-info-container">
          {domInfoActionsLeft}
          {domInfoActionsRight}
          {domActions}
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
