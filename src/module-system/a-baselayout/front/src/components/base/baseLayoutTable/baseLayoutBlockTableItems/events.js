export default {
  methods: {
    onPageCurrentChanged() {
      // always true
      this._scroll(true);
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

      // not use currentTarget, because currentTarget is tr
      const $targetTd = this.$$(event.target).closest('td');
      const target = $targetTd.length === 0 ? event.target : $targetTd;
      // finished the event immediately
      this.$nextTick(() => {
        this.$f7.popover.open(popover, target);
        // record
        this.contextmenuRecordKey = item[this.itemKey];
        this.onSwipeoutOpened(null, item);
      });
    },
    onRowClick(event, item) {
      if (this.layoutManager.bulk[this.activeItemKey] !== item[this.itemKey]) {
        this.layoutManager.bulk[this.activeItemKey] = item[this.itemKey];
      }
      this.onRowContextMenu(event, item);
    },
    onRowMouseEnter(event, item) {
      if (this.layoutManager.bulk[this.hoverItemKey] !== item[this.itemKey]) {
        this.layoutManager.bulk[this.hoverItemKey] = item[this.itemKey];
      }
    },
    onRowMouseLeave(event, item) {
      if (this.layoutManager.bulk[this.hoverItemKey] === item[this.itemKey]) {
        this.layoutManager.bulk[this.hoverItemKey] = null;
      }
    },
  },
};
