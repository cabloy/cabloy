import Vue from 'vue';
const f7CheckBox = Vue.options.components['f7-checkbox'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-checkbox',
  extends: f7CheckBox,
  methods: {
    onChange(event) {
      this.$emit('input', event.currentTarget.value);
    },
  },
};
