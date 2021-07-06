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
  methods: {},
  render() {
    return (
      <f7-nav-right class="atom-item-title-info-container">
        {this.layoutManager.info_renderActionsLeft()}
        {this.layoutManager.info_renderActionsRight()}
        {this.layoutManager.info_renderFlowStatus()}
      </f7-nav-right>
    );
  },
};
