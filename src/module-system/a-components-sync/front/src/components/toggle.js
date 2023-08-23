import Vue from 'vue';
let f7Toggle = Vue.options.components['f7-toggle'].extendOptions;
f7Toggle = Vue.prototype.$meta.util.patchF7ExtendOptions(f7Toggle, 'checked,value');
export default {
  meta: {
    global: true,
  },
  name: 'eb-toggle',
  extends: f7Toggle,
  props: {
    value: {
      type: [Boolean, Number],
      default: false,
    },
  },
  data() {
    return {
      checked: this.value,
    };
  },
  watch: {
    value() {
      this.checked = this.value;
    },
  },
  methods: {
    onChange(event) {
      this.$emit('input', event.currentTarget.checked);
    },
  },
};
