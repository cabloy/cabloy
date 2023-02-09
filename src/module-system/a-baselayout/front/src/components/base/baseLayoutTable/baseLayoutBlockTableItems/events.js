const _heightTableHeader = 44;
export default {
  methods: {
    onPageCurrentChanged() {
      // always true
      this._scroll(true);
    },
    onViewSizeChange(size) {
      this.tableHeight = size.height - _heightTableHeader;
    },
    onTableChange(pagination, filters, sorter) {
      if (!this.enableOrder) return;
      const { field, order = 'ascend' } = sorter;
      const currentOrder = this._columnSorterCurrent(field);
      if (currentOrder === order) return;
      const _order = this._columnSorterFind(field);
      this.layoutManager.order_onPerformChange(null, _order);
    },
    onSelectChange(selectedRowKeys) {
      if (!this.enableSelection) return;
      const items = this.layoutManager.base_getItems();
      // eslint-disable-next-line
      this.layoutManager.bulk[this.selectedItemsKey] = items.filter(item => {
        return selectedRowKeys.findIndex(rowKey => rowKey === item[this.itemKey]) > -1;
      });
    },
    onSwipeoutOpened(event, item) {
      // callback
      if (this.layoutManager.layout_onSwipeoutOpened) {
        this.layoutManager.layout_onSwipeoutOpened(event, item);
      }
    },
    onRowContextMenu(event, item) {
      // popover
      const popover = this.$$(this.$el).find('.popover');
      if (popover.length === 0) return;

      event.stopPropagation();
      event.preventDefault();

      const target = event.target;
      // finished the event immediately
      this.$nextTick(() => {
        this.$f7.popover.open(popover, target);
        // record
        this.contextmenuRecord = item;
        this.onSwipeoutOpened(null, item);
      });
    },
    onRowClick(event, item) {
      this.layoutManager.bulk[this.activeItemKey] = item;
    },
  },
};
