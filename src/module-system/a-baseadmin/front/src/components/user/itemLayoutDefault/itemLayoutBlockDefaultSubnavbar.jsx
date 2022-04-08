import itemLayoutBlockDefaultActions from './itemLayoutBlockDefaultActions.jsx';

export default {
  meta: {
    global: false,
  },
  mixins: [itemLayoutBlockDefaultActions],
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
  methods: {
    _renderActionsLeft() {
      const children = this.info_renderActionsLeft();
      return <div class="actions-block actions-block-left">{children}</div>;
    },
    _renderActionsRight() {
      const children = this.info_renderActionsRight();
      return <div class="actions-block actions-block-right">{children}</div>;
    },
  },
  render() {
    return (
      <f7-subnavbar>
        <div class="atom-item-subnavbar-container">
          {this._renderActionsLeft()}
          {this._renderActionsRight()}
        </div>
      </f7-subnavbar>
    );
  },
};
