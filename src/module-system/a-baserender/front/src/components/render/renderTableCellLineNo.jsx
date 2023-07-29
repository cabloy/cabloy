import Vue from 'vue';
const ebRenderTableCellBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebRenderTableCellBase;

export default {
  mixins: [ebRenderTableCellBase],
  data() {
    return {};
  },
  created() {},
  methods: {},
  render() {
    const indexTotal = this.info.indexTotal;
    return <span>{indexTotal + 1}</span>;
  },
};
