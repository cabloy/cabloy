import Vue from 'vue';
const ebViewSizeChange = Vue.prototype.$meta.module.get('a-components').options.mixins.ebViewSizeChange;
const _heightTableHeader = 44;

export default {
  mixins: [ebViewSizeChange],
  data() {
    return {
      tableHeight: 0,
      // viewSize
      header: true,
      // toolbar: true,
    };
  },
  computed: {
    enableTableHeight() {
      return this.blockConfig.enableTableHeight !== false;
    },
  },
  methods: {
    onViewSizeChange(size) {
      this.tableHeight = size.height - _heightTableHeader;
    },
    _getTableScroll() {
      const cellWidthDefault = this.$config.table.cell.width.default;
      const scroll = {};
      // y
      if (this.enableTableHeight) {
        scroll.y = this.tableHeight;
      }
      // x
      let x = 0;
      const columns = this.blockConfig.columns;
      for (const column of columns) {
        if (column.visible === false) continue;
        const width = column.width;
        x += !width ? cellWidthDefault : parseInt(width);
      }
      scroll.x = x;
      // ok
      return scroll;
    },
  },
};
