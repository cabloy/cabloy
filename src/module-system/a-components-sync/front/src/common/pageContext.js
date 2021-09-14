export default {
  data() {
    return {
      pageContext: this.$f7route.context,
      contextParams: this.$f7route.context && this.$f7route.context.params,
    };
  },
  methods: {
    contextCallback(code, data) {
      if (this.pageContext && this.pageContext.callback) {
        this._callbackCalled = true;
        this.pageContext.callback(code, data);
      }
    },
    setPageContext(pageContext) {
      this.pageContext = pageContext;
      this.contextParams = pageContext.params;
    },
  },
  created() {
    if (this.pageContext && this.pageContext.callback) {
      this.pageContext.callback(201, this);
    }
  },
  beforeDestroy() {
    if (this.pageContext && this.pageContext.callback) {
      this.pageContext.callback(this._callbackCalled ? null : false);
    }
  },
  destroyed() {
    this.pageContext = null;
    this.contextParams = null;
  },
};
