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
      domTimeline = this.layoutManager.layout_renderBlock({
        blockName: 'timeline',
      });
    }
    return <div class="eb-atom-item-layout-default-main-before">{domTimeline}</div>;
  },
};
