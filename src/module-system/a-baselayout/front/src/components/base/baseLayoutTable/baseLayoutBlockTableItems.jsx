import Events from './baseLayoutBlockTableItems/events.js';
import Scroll from './baseLayoutBlockTableItems/scroll.js';

export default {
  meta: {
    global: false,
  },
  mixins: [Events, Scroll],
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
    itemKey() {
      return this.layoutManager.data.provider.itemKey;
    },
    selectedItemsKey() {
      return this.layoutManager.data.provider.selectedItemsKey || 'selectedItems';
    },
    activeItemKey() {
      return this.layoutManager.data.provider.activeItemKey || 'activeAtom';
    },
    hoverItemKey() {
      return this.layoutManager.data.provider.hoverItemKey || 'hoverAtom';
    },
    toolbar() {
      return this.layoutManager.bottombar.enable;
    },
    dataSource() {
      return this.layoutManager.data_getItems();
    },
    expandedRowKeys() {
      const treeviewData = this.layout.treeviewData;
      if (!treeviewData) return [];
      const rowKeys = [];
      treeviewData.treeDown(null, node => {
        if (node.attrs.opened) {
          rowKeys.push(node.data[this.itemKey]);
        }
      });
      return rowKeys;
    },
    columns() {
      const columns = this.blockConfig.columns;
      const _columns = [];
      for (const column of columns) {
        if (column.visible === false) continue;
        // extend
        const _column = this.$meta.util.extend({}, column);
        _column.columnConfig = column;
        // key
        _column.key = _column.key || _column.dataIndex;
        // title
        _column.title = this.$text(_column.title);
        // ellipsis
        _column.ellipsis = true;
        // customRender
        _column.customRender = this._customRender;
        _column.customCell = this._customCell;
        // sorter
        if (this.blockConfig.sorter !== false) {
          _column.sorter = !!this._columnSorterFind(_column.dataIndex);
          _column.sortOrder = this._columnSorterCurrent(_column.dataIndex);
        }
        // push
        _columns.push(_column);
      }
      return this.layoutManager.layout_extend_onTableColumns({ columns: _columns });
    },
    rowSelection() {
      if (!this.enableSelection) return null;
      const selectedRowKeys = this.layoutManager.bulk[this.selectedItemsKey].map(item => item[this.itemKey]);
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
    enableSelection() {
      return (
        this.layoutManager.bulk && this.layoutManager.bulk[this.selectedItemsKey] && this.layoutManager.bulk.selecting
      );
    },
    enableOrder() {
      return this.layoutManager.order_list;
    },
  },
  mounted() {
    // queueScroll
    this._queueScroll = this.$meta.util.queue(this._queueTaskScroll.bind(this));
    this.layoutManager.$on('providerPaged:pageCurrentChanged', this.onPageCurrentChanged);
  },
  beforeDestroy() {
    this.layoutManager.$off('providerPaged:pageCurrentChanged', this.onPageCurrentChanged);
  },
  methods: {
    _scroll(init) {
      this.$nextTick(() => {
        this._queueScroll.push(init);
      });
    },
    _queueTaskScroll(init, cb) {
      let scrollTopNew;
      const $tableBody = this.$$('.ant-table-body', this.$$(this.$el));
      if (init) {
        scrollTopNew = 0;
      } else {
        scrollTopNew = $tableBody[0].scrollHeight - $tableBody[0].offsetHeight;
        if (scrollTopNew <= 0) return cb();
      }
      if ($tableBody.scrollTop() === scrollTopNew) return cb();
      $tableBody.scrollTop(scrollTopNew, 300, cb);
    },
    _checkColumnNameEqualOrder(order, columnName) {
      // callback
      if (this.layoutManager.layout_onColumnNameEqualOrder) {
        return this.layoutManager.layout_onColumnNameEqualOrder(order, columnName);
      }
      return false;
    },
    _columnSorterFind(columnName) {
      return this.layoutManager.order_list.find(order => {
        return this._checkColumnNameEqualOrder(order, columnName);
      });
    },
    _columnSorterCurrent(columnName) {
      const orderCurrent = this.layoutManager.order_current;
      if (this._checkColumnNameEqualOrder(orderCurrent, columnName)) {
        return orderCurrent.by === 'desc' ? 'descend' : 'ascend';
      }
      return false;
    },
    _customRender(text, record, index, column) {
      const pageInfo = this.layoutManager.data.adapter.getPageInfo();
      let indexTotal;
      if (!pageInfo || pageInfo.pageCurrent === 0) {
        indexTotal = index;
      } else {
        indexTotal = (pageInfo.pageCurrent - 1) * pageInfo.pageSize + index;
      }
      // options
      let options = {
        props: {
          layoutManager: this.layoutManager,
          layout: this.layout,
          layoutItems: this,
          info: { text, record, index, indexTotal, column },
        },
      };
      // default
      if (!column.component) {
        // computed
        if (column.params && column.params.computed) {
          options.props.expression = column.params.computed.expression;
          return <eb-component module="a-baserender" name="renderTableCellComputed" options={options}></eb-component>;
        }
        // dateFormat
        if (column.params && column.params.dateFormat && typeof column.params.dateFormat === 'object') {
          options.props.dateFormat = column.params.dateFormat;
          return <eb-component module="a-baserender" name="renderTableCellDatetime" options={options}></eb-component>;
        }
        // default
        return <eb-component module="a-baserender" name="renderTableCellDefault" options={options}></eb-component>;
      }
      // component
      if (column.component.options) {
        options = this.$meta.util.extend({}, column.component.options, options);
      }
      return (
        <eb-component module={column.component.module} name={column.component.name} options={options}></eb-component>
      );
    },
    _customCell(record, index, column, { expandIcon }) {
      if (!record._treeviewNode || !expandIcon) return {};
      const node = record._treeviewNode;
      return {
        class: {
          'treeview-item-root-wrapper': true,
          'treeview-item-opened': node.attrs.opened,
          'treeview-load-children': node.attrs.loadChildren,
        },
      };
    },
    _getRowClassName(record) {
      const className = {};
      // active
      const activeItem = this.layoutManager.bulk[this.activeItemKey];
      if (activeItem && activeItem[this.itemKey] === record[this.itemKey]) {
        className.active = true;
      }
      return className;
    },
    _customRow(record) {
      return {
        className: this._getRowClassName(record),
        props: {},
        on: {
          click: event => {
            this.onRowClick(event, record);
          },
          mouseenter: event => {
            this.onRowMouseEnter(event, record);
          },
          mouseleave: event => {
            this.onRowMouseLeave(event, record);
          },
          contextmenu: event => {
            this.onRowContextMenu(event, record);
          },
        },
      };
    },
    _prepareNodeAttrs(node) {
      // attrs
      const _node = { ...node };
      _node.attrs = this.$utils.extend({}, node.attrs);
      // attrs
      const treeviewData = this.layout.treeviewData;
      const treeviewRoot = treeviewData.treeviewRoot;
      if (_node.attrs.itemToggle === undefined) _node.attrs.itemToggle = treeviewRoot.attrs.itemToggle;
      if (_node.attrs.opened === undefined) _node.attrs.opened = false;
      if (_node.attrs.checkbox === undefined) _node.attrs.checkbox = treeviewRoot.attrs.checkbox;
      if (_node.attrs.selectable === undefined) _node.attrs.selectable = treeviewRoot.attrs.selectable;
      if (_node.attrs.selectable) {
        _node.attrs.selected = treeviewData.selectedItem && treeviewData.selectedItem.id === node.id;
      }
      if (_node.attrs.disabled === undefined) _node.attrs.disabled = treeviewRoot.attrs.disabled;
      // attrs folder
      if (_node.attrs.folder) {
        if (_node.attrs.opened === true) {
          _node.attrs.iconF7 = '::folder-open';
        } else {
          _node.attrs.iconF7 = '::folder';
        }
      }
      // ok
      return _node;
    },
    _expandIcon({ record }) {
      if (!record._treeviewNode) return null;
      // node
      const node = this._prepareNodeAttrs(record._treeviewNode);
      // attrs
      const {
        id,
        toggle,
        loadChildren,
        icon,
        iconMaterial,
        iconF7,
        iconMd,
        iconIos,
        iconAurora,
        iconSize,
        iconColor,
        loading,
      } = node.attrs;
      // loading
      let domLoading;
      if (loading) {
        domLoading = (
          <div
            class="preloader treeview-preloader"
            domProps={{
              innerHTML: this.$f7.utils[`${this.$f7.theme}PreloaderContent`],
            }}
          ></div>
        );
      }
      // toggle
      let domToggle;
      const needToggle = toggle || loadChildren;
      if (needToggle) {
        domToggle = (
          <div
            class={loading ? 'treeview-toggle treeview-toggle-hidden' : 'treeview-toggle'}
            onClick={() => {
              const treeviewData = this.layout.treeviewData;
              treeviewData.switchNode(node.id);
            }}
          ></div>
        );
      }
      // icon
      let domIcon;
      if (icon || iconMaterial || iconF7 || iconMd || iconIos || iconAurora) {
        domIcon = (
          <f7-icon
            material={iconMaterial}
            f7={iconF7}
            icon={icon}
            md={iconMd}
            ios={iconIos}
            aurora={iconAurora}
            color={iconColor}
            size={iconSize}
          ></f7-icon>
        );
      }
      // render
      return (
        <div id={id} class="treeview-item-root">
          {domLoading}
          {domToggle}
          {domIcon}
        </div>
      );
    },
    _renderListItemContextMenu() {
      if (!this.layoutManager.item_renderContextMenu) return null;
      const item = this.contextmenuRecord;
      return this.layoutManager.item_renderContextMenu(item, 'menu');
    },
    _renderTable() {
      const scroll = this._getTableScroll();
      const indentSize = this.blockConfig.indentSize || 29;
      return (
        <a-table
          bordered
          rowSelection={this.rowSelection}
          columns={this.columns}
          rowKey={item => item[this.itemKey]}
          expandedRowKeys={this.expandedRowKeys}
          dataSource={this.dataSource}
          pagination={false}
          scroll={scroll}
          indentSize={indentSize}
          onChange={this.onTableChange}
          customRow={this._customRow}
          expandIcon={this._expandIcon}
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
