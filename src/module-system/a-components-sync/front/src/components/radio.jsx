import Vue from 'vue';
const f7Radio = Vue.options.components['f7-radio'].extendOptions;
delete f7Radio.props.checked;
export default {
  meta: {
    global: true,
  },
  name: 'eb-radio',
  extends: f7Radio,
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
