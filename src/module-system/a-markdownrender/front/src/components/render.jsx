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
      if (newValue === this.htmlInner) return;
      this.htmlInner = newValue;
      this.$nextTick(() => {
        this._setHtml(newValue);
      });
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this._unmountHtml();
  },
  methods: {
    async init() {
      await this.$meta.module.use(this.$meta.config.markdown.style.module);
      await this._setHtml(this.htmlInner);
    },
    async _setHtml(html) {
      await this._unmountHtml();
      this.$refs.html.innerHTML = html;
      this._mountHtml();
    },
    async _mountHtml() {
      const blocks = this.$$('.markdown-it-cabloy-block', this.$refs.html);
      console.log(blocks.length);
    },
    async _unmountHtml() {},
  },
  render() {
    return <div ref="html" class="markdown-body"></div>;
  },
};
