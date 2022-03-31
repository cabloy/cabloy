import itemLayoutBlockDefaultActions from './itemLayoutBlockDefaultActions.jsx';

export default {
  meta: {
    global: false,
  },
  mixin: [itemLayoutBlockDefaultActions],
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
      return <f7-nav-right>{this.layoutManager.actions_render()}</f7-nav-right>;
    },
    _renderFull() {
      return (
        <f7-nav-right class="atom-item-title-info-container">
          {this.layoutManager.info_renderActionsLeft()}
          {this.layoutManager.info_renderActionsRight()}
          {this.layoutManager.actions_render()}
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
