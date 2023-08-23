import Vue from 'vue';
const f7CheckBox = Vue.options.components['f7-checkbox'].extendOptions;
delete f7CheckBox.props.checked;
export default {
  meta: {
    global: true,
  },
  name: 'eb-checkbox',
  extends: f7CheckBox,
  data() {
    return {
      checked: false,
    };
  },
  watch: {
    value(value) {
      this.checked = value;
    },
  },
  created() {
    this.checked = Boolean(this.value);
  },
  methods: {
    onChange(event) {
      // special for .checked, not use .value
      this.$emit('input', event.currentTarget.checked);
    },
  },
};
