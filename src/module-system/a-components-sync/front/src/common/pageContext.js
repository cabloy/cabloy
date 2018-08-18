export default {
  meta: {
    component: false,
  },
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
  },
  beforeDestroy() {
    if (this.pageContext && this.pageContext.callback) {
      this.pageContext.callback(this._callbackCalled ? null : false);
    }
  },
};

