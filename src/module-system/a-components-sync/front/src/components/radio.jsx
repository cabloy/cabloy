import Vue from 'vue';
let f7Radio = Vue.options.components['f7-radio'].extendOptions;
f7Radio = Vue.prototype.$meta.util.patchF7ExtendOptions(f7Radio, 'checked');
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
