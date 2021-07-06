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
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: `${size.height - 20}px`,
        width: `${size.width - 20}px`,
      });
    },
    onInput(event) {
      this._onInputDelay(event.target.value);
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
    return (
      <eb-box onSize={this.onSize} header subnavbar>
        <textarea
          ref="textarea"
          readonly={this.readOnly ? 'readonly' : false}
          type="textarea"
          value={this.contentListener}
          onInput={this.onInput}
          class="json-textarea json-textarea-margin"
        ></textarea>
      </eb-box>
    );
  },
};
