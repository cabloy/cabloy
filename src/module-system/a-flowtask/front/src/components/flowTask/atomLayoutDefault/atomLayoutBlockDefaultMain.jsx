export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  render() {
    const domValidate = this.layoutManager.validate_render();
    const domActions = this.layoutManager.actions_renderActionComponents();
    return (
      <div>
        {domValidate}
        {domActions}
      </div>
    );
  },
};
