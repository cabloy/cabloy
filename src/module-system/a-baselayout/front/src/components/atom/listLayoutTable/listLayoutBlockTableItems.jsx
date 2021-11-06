import Vue from 'vue';
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;
const ebViewSizeChange = Vue.prototype.$meta.module.get('a-components').options.mixins.ebViewSizeChange;
const _heightTableHeader = 44;
export default {
  meta: {
    global: false,
  },
  mixins: [ebAtomActions, ebViewSizeChange],
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
      tableHeight: 0,
      contextmenuRecord: null,
      // viewSize
      header: true,
      toolbar: true,
    };
  },
  computed: {
    columns() {
      const columns = this.blockConfig.columns;
      let _columns = [];
      for (const column of columns) {
        if (column.visible === false) continue;
        // extend
        const _column = this.$meta.util.extend({}, column);
        // key
        _column.key = _column.key || _column.dataIndex;
        // title
        _column.title = this.$text(_column.title);
        // ellipsis
        _column.ellipsis = true;
        // customRender
        _column.customRender = this._customRender;
        // sorter
        _column.sorter = !!this._columnSorterFind(_column.dataIndex);
        _column.sortOrder = this._columnSorterCurrent(_column.dataIndex);
        // push
        _columns.push(_column);
      }
      if (this.layout.onColumns) {
        _columns = this.layout.onColumns({ columns: _columns });
      }
      return _columns;
    },
    rowSelection() {
      if (!this.layoutManager.bulk.selecting) return null;
      const selectedRowKeys = this.layoutManager.bulk.selectedAtoms.map(item => item.atomId);
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  methods: {
    onViewSizeChange(size) {
      this.tableHeight = size.height - _heightTableHeader;
    },
    onTableChange(pagination, filters, sorter) {
      const { field, order = 'ascend' } = sorter;
      const currentOrder = this._columnSorterCurrent(field);
      if (currentOrder === order) return;
      const atomOrder = this._columnSorterFind(field);
      this.layoutManager.order_onPerformChange(null, atomOrder);
    },
    onSelectChange(selectedRowKeys) {
      const items = this.layoutManager.base_getItems();
      // eslint-disable-next-line
      this.layoutManager.bulk.selectedAtoms = items.filter(item => {
        return selectedRowKeys.findIndex(atomId => atomId === item.atomId) > -1;
      });
    },
    onSwipeoutOpened(event, item) {
      this.layoutManager.actions_fetchActions(item);
    },
    _checkColumnNameEqualOrder(atomOrder, columnName) {
      const key = this.layoutManager.order_getKey(atomOrder);
      return key === `a.${columnName}` || key === `f.${columnName}` || key === columnName;
    },
    _columnSorterFind(columnName) {
      return this.layoutManager.order_list.find(atomOrder => {
        return this._checkColumnNameEqualOrder(atomOrder, columnName);
      });
    },
    _columnSorterCurrent(columnName) {
      const atomOrderCurrent = this.layoutManager.order_current;
      if (this._checkColumnNameEqualOrder(atomOrderCurrent, columnName)) {
        return atomOrderCurrent.by === 'desc' ? 'descend' : 'ascend';
      }
      return false;
    },
    _customRender(text, record, index, column) {
      // options
      let options = {
        props: {
          layoutManager: this.layoutManager,
          layout: this.layout,
          layoutItems: this,
          info: { text, record, index, column },
        },
      };
      // default
      if (!column.component) {
        // computed
        if (column.params && column.params.computed) {
          options.props.expression = column.params.computed.expression;
          return <eb-component module="a-basefront" name="renderTableCellComputed" options={options}></eb-component>;
        }
        // default
        return <eb-component module="a-basefront" name="renderTableCellDefault" options={options}></eb-component>;
      }
      // component
      if (column.component.options) {
        options = this.$meta.util.extend({}, column.component.options, options);
      }
      return (
        <eb-component module={column.component.module} name={column.component.name} options={options}></eb-component>
      );
    },
    _customRow(record) {
      return {
        props: {},
        on: {
          contextmenu: event => {
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
              this.contextmenuRecord = record;
              this.onSwipeoutOpened(null, record);
            });
          },
        },
      };
    },
    _renderListItemContextMenu() {
      const item = this.contextmenuRecord;
      return this.layoutManager.data.adapter.item_renderContextMenu(item, 'menu');
    },
    _renderTable() {
      const items = this.layoutManager.data_getItems();
      return (
        <a-table
          bordered
          rowSelection={this.rowSelection}
          columns={this.columns}
          rowKey={item => item.atomId}
          dataSource={items}
          pagination={false}
          scroll={{ y: this.tableHeight }}
          onChange={this.onTableChange}
          customRow={this._customRow}
        ></a-table>
      );
    },
  },
  render() {
    return (
      <div class="atom-list-layout-table-container">
        {this._renderTable()}
        {this._renderListItemContextMenu()}
      </div>
    );
  },
};
