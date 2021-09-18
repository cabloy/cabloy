import Vue from 'vue';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
  ],
  methods: {
    onAction() {
      if (this.action.name === 'atomName') {
        return this.onAction_atomName();
      }
    },
    onAction_atomName() {
      const { ctx, item } = this.$props;
      const { key, property, dataPath, value, operator } = item;
      return { a: 1 };
    },
  },
};
