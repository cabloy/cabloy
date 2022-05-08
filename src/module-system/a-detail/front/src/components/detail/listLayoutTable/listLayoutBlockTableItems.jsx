export default {
  meta: {
    global: false,
  },
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
      contextmenuRecord: null,
    };
  },
  computed: {
    columns() {
      const columns = this.blockConfig.columns;
      const _columns = [];
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
        // push
        _columns.push(_column);
      }
      return _columns;
    },
  },
  methods: {
    onSwipeoutOpened(/* event, item*/) {},
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
        // dateFormat
        if (column.params && column.params.dateFormat && typeof column.params.dateFormat === 'object') {
          options.props.dateFormat = column.params.dateFormat;
          return <eb-component module="a-basefront" name="renderTableCellDatetime" options={options}></eb-component>;
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
      return this.layoutManager.item_renderContextMenu(item, 'menu');
    },
    _renderTable() {
      const items = this.layoutManager.data_getItems();
      return (
        <a-table
          bordered
          columns={this.columns}
          rowKey={item => item.detailId}
          dataSource={items}
          pagination={false}
          customRow={this._customRow}
        ></a-table>
      );
    },
  },
  render() {
    return (
      <div class="detail-list-layout-table-container">
        {this._renderTable()}
        {this._renderListItemContextMenu()}
      </div>
    );
  },
};
