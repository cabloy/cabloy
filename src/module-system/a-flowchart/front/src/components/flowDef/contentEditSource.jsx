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
  created() {
    this.init();
  },
  methods: {
    async init() {
      // json editor
      await this.$meta.module.use('a-jsoneditor');
      // ok
      this.ready = true;
    },
    onInput(data) {
      try {
        const value = window.JSON5.parse(data);
        this.$emit('contentChange', { type: 'process', value, valueStr: data });
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    },
    onSaveEditor() {
      this.onSave();
    },
  },
  render() {
    if (!this.ready) return <div></div>;
    return <eb-json-editor ref="jsonEditor" readOnly={this.readOnly} valueType="string" value={this.contentProcessStr} onInput={this.onInput} onSave={this.onSaveEditor}></eb-json-editor>;
  },
};
