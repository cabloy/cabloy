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
    layoutItems: {
      type: Object,
    },
    info: {
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
      <div>
        {this.layoutManager.data.adapter.item_renderMedia(this.info.record, 'avatar avatar24 eb-vertical-align')}
        <span>&nbsp;{this.info.text}</span>
      </div>
    );
  },
};
