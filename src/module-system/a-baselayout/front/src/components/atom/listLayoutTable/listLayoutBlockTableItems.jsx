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
      // toolbar: true,
    };
  },
  computed: {
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
          rowKeys.push(node.data.atomId);
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
      if (!this.layoutManager.bulk.selecting) return null;
      const selectedRowKeys = this.layoutManager.bulk.selectedAtoms.map(item => item.atomId);
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
      };
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
    onPageCurrentChanged() {
      // always true
      this._scroll(true);
    },
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
      const item = this.contextmenuRecord;
      return this.layoutManager.data.adapter.item_renderContextMenu(item, 'menu');
    },
    _renderTable() {
      return (
        <a-table
          bordered
          rowSelection={this.rowSelection}
          columns={this.columns}
          rowKey={item => item.atomId}
          expandedRowKeys={this.expandedRowKeys}
          dataSource={this.dataSource}
          pagination={false}
          scroll={{ y: this.tableHeight }}
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
