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
    return <div class="eb-mine-footer">{this.$text('CopyrightTip')}</div>;
  },
};
