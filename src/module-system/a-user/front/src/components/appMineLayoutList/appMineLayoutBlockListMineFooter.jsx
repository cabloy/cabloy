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
    let configCopyright = this.$config.copyright[this.$meta.util.getLocale()];
    if (!configCopyright) configCopyright = this.$config.copyright['en-us'];
    return <div class="eb-mine-footer">{configCopyright}</div>;
  },
};
