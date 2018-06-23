export default {
  props: {
    dataPath: {
      type: String,
    },
  },
  data() {
    return {
      _validate: null,
      _unwatch: null,
    };
  },
  mounted() {
    this._validate = this.getValidate();
    if (this._validate) {
      this.checkValidateError();
      this._unwatch = this._validate.$watch('verrors', () => {
        this.checkValidateError();
      });
    }
  },
  beforeDestroy() {
    if (this._unwatch) {
      this._unwatch();
      this._unwatch = null;
    }
    this._validate = null;
  },
  methods: {
    getValidate() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options._componentTag === 'eb-validate') break;
        parent = parent.$parent;
      }
      return parent;
    },
    clearValidateError() {
      if (this._validate) this._validate.clearError(this.dataPath);
    },
    checkValidateError() {
      this.$nextTick(() => {
        this.onValidateError(this._validate.getError(this.dataPath));
      });
    },
  },
};
