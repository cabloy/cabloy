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
      const scroll = {};
      if (this.enableTableHeight) {
        scroll.y = this.tableHeight;
      }
      // scroll.x = 1300;
      return scroll;
    },
  },
};
