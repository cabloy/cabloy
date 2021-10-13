export default {
  meta: {
    global: false,
  },
  props: {
    readOnly: {
      type: Boolean,
    },
    contentProcessStr: {
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
    onInput(data) {
      try {
        const value = window.JSON5.parse(data);
        this.$emit('contentChange', { type: 'process', value, valueStr: data });
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
        value={this.contentProcessStr}
        onInput={this.onInput}
        onSave={this.onSaveEditor}
      ></eb-json-editor>
    );
  },
};
