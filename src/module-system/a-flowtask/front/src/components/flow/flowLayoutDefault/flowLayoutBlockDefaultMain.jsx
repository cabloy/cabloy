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
    const domTimeline = this.layoutManager.timeline_render();
    const domActions = this.layoutManager.actions_renderActionComponents();
    return (
      <div>
        {domTimeline}
        {domActions}
      </div>
    );
  },
};
