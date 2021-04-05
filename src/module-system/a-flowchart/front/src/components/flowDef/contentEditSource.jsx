import Vue from 'vue';
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
      this._onInputDelay(event.target.value);
    },
    _onInputDelay: Vue.prototype.$meta.util.debounce(function(data) {
      try {
        const value = JSON5.parse(data);
        this.$emit('contentChange', { type: 'process', value });
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    }, 500),
  },
  render() {
    return (
      <eb-box onSize={this.onSize} header subnavbar>
        <textarea ref="textarea" readonly={this.readOnly ? 'readonly' : false} type="textarea" value={this.contentProcess2} onInput={this.onInput} class="json-textarea json-textarea-margin"></textarea>
      </eb-box>
    );
  },
};
