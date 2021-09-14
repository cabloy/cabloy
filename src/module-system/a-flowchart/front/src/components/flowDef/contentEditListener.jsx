import Vue from 'vue';
export default {
  meta: {
    global: false,
  },
  props: {
    readOnly: {
      type: Boolean,
    },
    contentListener: {
      type: String,
    },
    onSave: {
      type: Function,
    },
  },
  data() {
    return {
      ready: false,
    };
  },
  created() {},
  methods: {
    async reload() {
      // json editor
      await this.$meta.module.use('a-jsoneditor');
      // ok
      this.ready = true;
    },
    onSaveEditor() {
      this.onSave();
    },
    onInput(value) {
      this._onInputDelay(value);
    },
    _onInputDelay: Vue.prototype.$meta.util.debounce(function (value) {
      try {
        this.$emit('contentChange', { type: 'listener', value });
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    }, 500),
  },
  render() {
    if (!this.ready) return <div></div>;
    return <eb-json-editor ref="jsonEditor" readOnly={this.readOnly} valueType="string" valueMode="js" value={this.contentListener} onInput={this.onInput} onSave={this.onSaveEditor}></eb-json-editor>;
  },
};
