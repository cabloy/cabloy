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
      if (this._validate) this._validate.clearError(this.getDataPath());
    },
    checkValidateError() {
      // should twice
      this.$nextTick(() => {
        this.$nextTick(() => {
          // maybe null
          if (this._validate) {
            this.onValidateError(this._validate.getError(this.getDataPath()));
          }
        });
      });
    },
    getDataPath() {
      return this.dataPath;
    },
    _clearValidateError_input() {
      this.$nextTick(() => {
        const input = this._findInputTextElement();
        if (input[0]) {
          input[0].ebCustomError = null;
        }
        this.clearValidateError();
      });
    },
    _findInputTextElement() {
      const tag = this.type === 'textarea' ? 'textarea' : 'input';
      return this.$$(this.$el).find(tag);
    },
  },
};
