export default {
  meta: {
    global: false,
  },
  props: {
    readOnly: {
      type: Boolean,
    },
    contentProcess: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    contentProcess2() {
      return JSON5.stringify(this.contentProcess, null, 2);
    },
  },
  created() {
  },
  mounted() {
    this.__init();
  },
  methods: {
    __init() {
    },
    onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: `${size.height - 20}px`,
        width: `${size.width - 20}px`,
      });
    },
    onInput(event) {
      try {
        const process = JSON5.parse(event.target.value);
        this.$emit('contentChange', { process });
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    },
  },
  render() {
    return (
      <eb-box onSize={this.onSize} header subnavbar>
        <textarea ref="textarea" readonly={this.readOnly ? 'readonly' : false} type="textarea" value={this.contentProcess2} onInput={this.onInput} class="json-textarea json-textarea-margin"></textarea>
      </eb-box>
    );
  },
};
