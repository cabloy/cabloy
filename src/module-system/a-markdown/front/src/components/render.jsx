export default {
  meta: {
    global: true,
  },
  name: 'eb-markdown-render',
  props: {
    html: {
      type: String,
    },
  },
  data() {
    return {
      htmlInner: this.html,
    };
  },
  watch: {
    html(newValue) {
      if (newValue === this.lastValue) return;
      this.lastValue = newValue;
      if (this.viewWrapper) {
        this.viewWrapper.update();
      }
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {},
};
