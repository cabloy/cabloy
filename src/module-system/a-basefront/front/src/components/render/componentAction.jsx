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
      if (this.action.name === 'dateRange') return this._renderDateRange();
    },
    _renderDateRange() {
      return <eb-list-item title="title"></eb-list-item>;
    },
  },
};
