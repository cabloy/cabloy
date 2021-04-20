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
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: `${size.height - 20}px`,
        width: `${size.width - 20}px`,
      });
    },
    onInput(event) {
      const data = event.target.value;
      try {
        const value = window.JSON5.parse(data);
        this.$emit('contentChange', { type: 'process', value, valueStr: data });
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    },
  },
  render() {
    return (
      <eb-box onSize={this.onSize} header subnavbar>
        <textarea ref="textarea" readonly={this.readOnly ? 'readonly' : false} type="textarea" value={this.contentProcessStr} onInput={this.onInput} class="json-textarea json-textarea-margin"></textarea>
      </eb-box>
    );
  },
};
