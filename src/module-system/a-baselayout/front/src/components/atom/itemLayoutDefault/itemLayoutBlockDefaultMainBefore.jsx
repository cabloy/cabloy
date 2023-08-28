export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layoutConfig: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {},
  render() {
    let domTimeline;
    if (this.layoutConfig.blocks.timeline) {
      const timelineInstance = this.layoutManager.timeline.instance;
      if (timelineInstance) {
        domTimeline = this.layoutManager.layout_renderBlock({
          blockName: 'timeline',
          info: {
            timelineInstance,
          },
        });
      }
    }
    return <div class="eb-atom-item-layout-default-main-before">{domTimeline}</div>;
  },
};
