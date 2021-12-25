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
  created() {
    this.onInputDelay = this.$meta.util.debounce(value => {
      this._onInputDelay(value);
    }, 500);
  },
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
      this.onInputDelay(value);
    },
    _onInputDelay(value) {
      try {
        this.$emit('contentChange', { type: 'listener', value });
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    },
  },
  render() {
    if (!this.ready) return <div></div>;
    return (
      <eb-json-editor
        ref="jsonEditor"
        readOnly={this.readOnly}
        valueType="string"
        valueMode="js"
        value={this.contentListener}
        onInput={this.onInput}
        onSave={this.onSaveEditor}
      ></eb-json-editor>
    );
  },
};
