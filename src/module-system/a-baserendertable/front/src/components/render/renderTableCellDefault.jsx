import Vue from 'vue';
const ebRenderTableCellBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebRenderTableCellBase;

export default {
  mixins: [ebRenderTableCellBase],
  data() {
    return {};
  },
  methods: {},
  render() {
    const { text } = this.info;
    const value = this.base_formatText({ text });
    return (
      <div class="eb-antdv-table-cell" title={value}>
        {value}
      </div>
    );
  },
};
