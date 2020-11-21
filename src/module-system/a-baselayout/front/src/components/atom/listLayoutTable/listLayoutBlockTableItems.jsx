import Vue from 'vue';
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;
const ebViewSizeChange = Vue.prototype.$meta.module.get('a-components').options.mixins.ebViewSizeChange;
const _heightTableHeader = 44;
export default {
  meta: {
    global: false,
  },
  mixins: [ ebAtomActions, ebViewSizeChange ],
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
        // sorter
        _column.sorter = !!this._columnSorterFind(_column.dataIndex);
        _column.sortOrder = this._columnSorterCurrent(_column.dataIndex);
        // push
        _columns.push(_column);
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
  mounted() {
    this.$meta.eventHub.$on('atom:star', this.onStarChanged);
    this.$meta.eventHub.$on('atom:labels', this.onLabelsChanged);
    this.$meta.eventHub.$on('atom:action', this.onActionChanged);
    this.$meta.eventHub.$on('atom:actions', this.onActionsChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atom:star', this.onStarChanged);
    this.$meta.eventHub.$off('atom:labels', this.onLabelsChanged);
    this.$meta.eventHub.$off('atom:action', this.onActionChanged);
    this.$meta.eventHub.$off('atom:actions', this.onActionsChanged);
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
      this.layoutManager.bulk.selectedAtoms = items.filter(item => {
        return selectedRowKeys.findIndex(atomId => atomId === item.atomId) > -1;
      });
    },
    onItemClick(event, item) {
      return this.onAction(event, item, {
        module: item.module,
        atomClassName: item.atomClassName,
        name: 'read',
      });
    },
    onSwipeoutOpened(event, item) {
      if (item._actions) return;
      this.$api.post('/a/base/atom/actions', {
        key: { atomId: item.atomId },
        basic: !this.$device.desktop,
      }).then(data => {
        Vue.set(item, '_actions', data);
      });
    },
    onLabel(event, item) {
      // anonymous
      if (this.layoutManager.base_user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please Sign In')).then(() => {
          // login
          this.$meta.vueLayout.openLogin();
        });
        return;
      }
      // navigate
      this.$view.navigate(`/a/basefront/atom/labels?atomId=${item.atomId}`, {
        // target: '_self',
      });
      this.$meta.util.swipeoutClose(event.target);
    },
    onStarSwitch(event, item) {
      const star = item.star ? 0 : 1;
      return this._onStarSwitch(event, item, star, 'swipeoutClose');
    },
    onAction(event, item, action) {
      const _action = this.getAction(action);
      if (!_action) return;
      return this.$meta.util.performAction({ ctx: this, action: _action, item })
        .then(() => {
          this.$meta.util.swipeoutClose(event.target);
        });
    },
    onStarChanged(data) {
      const { items, index } = this.layout._findItem(data.key.atomId);
      if (index !== -1) {
        items[index].star = data.star;
      }
    },
    onLabelsChanged(data) {
      const { items, index } = this.layout._findItem(data.key.atomId);
      if (index !== -1) {
        items[index].labels = JSON.stringify(data.labels);
      }
    },
    onActionChanged(data) {
      const key = data.key;
      const action = data.action;
      // create
      if (action.menu === 1 && action.action === 'create') {
        // do nothing
        return;
      }
      // delete
      const { items, index } = this.layout._findItem(key.atomId);
      if (action.name === 'delete') {
        if (index !== -1) {
          items.splice(index, 1);
          this.layout.info.total -= 1;
        }
        return;
      }
      // others
      if (index !== -1) {
        const options = this.layoutManager.base_prepareReadOptions();
        this.$api.post('/a/base/atom/read', {
          key,
          options,
        }).then(data => {
          Vue.set(items, index, data);
        });
      }
    },
    onActionsChanged(data) {
      const key = data.key;
      const { items, index } = this.layout._findItem(key.atomId);
      if (index !== -1) {
        Vue.set(items[index], '_actions', null);
      }
    },
    _onStarSwitch(event, item, star, swipeoutAction) {
      // anonymous
      if (this.layoutManager.base_user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please Sign In')).then(() => {
          // login
          this.$meta.vueLayout.openLogin();
        });
        return;
      }
      // key
      const key = {
        atomId: item.atomId,
        itemId: item.itemId,
      };
      //
      return this.$api.post('/a/base/atom/star', {
        key,
        atom: { star },
      }).then(data => {
        this.$meta.eventHub.$emit('atom:star', { key, star: data.star, starCount: data.starCount });
        this.$meta.util[swipeoutAction](event.target);
      });
    },
    _getItemMetaMedia(item) {
      const media = (item._meta && item._meta.media) || item.avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 24);
    },
    _getItemMetaMediaLabel(item) {
      const mediaLabel = (item._meta && item._meta.mediaLabel) || item.userName;
      return mediaLabel;
    },
    _getItemMetaSummary(item) {
      const summary = (item._meta && item._meta.summary) || '';
      if (this.layoutManager.container.atomClass) {
        return summary;
      }
      const atomClass = this.layoutManager.getAtomClass({
        module: item.module,
        atomClassName: item.atomClassName,
      });
      if (!atomClass) return summary;
      return `${atomClass.titleLocale} ${summary}`;
    },
    _getItemMetaFlags(item) {
      const flags = (item._meta && item._meta.flags);
      if (!flags) return [];
      if (Array.isArray(flags)) return flags;
      return flags.split(',');
    },
    _getLabel(id) {
      if (!this.layoutManager.base_userLabels) return null;
      return this.layoutManager.base_userLabels[id];
    },
    _getActionColor(action, index) {
      if (index === 0) return 'orange';
      else if (index === 1) return 'red';
      return 'blue';
    },
    _getActionTitle(action, item) {
      return this.getActionTitle(action, item.atomStage);
    },
    _columnSorterFind(columnName) {
      return this.layoutManager.order_list.find(atomOrder => {
        const key = this.layoutManager.order_getKey(atomOrder);
        if (key === `a.${columnName}` || key === `f.${columnName}`) return true;
        return false;
      });
    },
    _columnSorterCurrent(columnName) {
      const atomOrderCurrent = this.layoutManager.order_current;
      const key = this.layoutManager.order_getKey(atomOrderCurrent);
      if (key === `a.${columnName}` || key === `f.${columnName}`) {
        return atomOrderCurrent.by === 'desc' ? 'descend' : 'ascend';
      }
      return false;
    },
    _customRender(text, record, index, column) {
      if (!column.component) {
        if (text === null || text === undefined) {
          text = '';
        } else if (typeof text === 'object' && text instanceof Date) {
          text = this.$meta.util.formatDateTime(text, column.dateFormat);
        }
        if (column.textLocale) {
          text = this.$text(text);
        }
        return <div class="eb-antdv-table-cell" title={text}>{text}</div>;
      }
      // component
      const options = {
        props: {
          layoutManager: this.layoutManager,
          layout: this.layout,
          layoutItems: this,
          info: { text, record, index, column },
        },
      };
      return <eb-component module={column.component.module} name={column.component.name} options={options}></eb-component>;
    },
    _customRow(record) {
      return {
        props: {
        },
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
      // domLeft
      let domLeft;
      if (item && item.atomStage === 1) {
        const domLeftStar = (
          <div color="teal" propsOnPerform={event => this.onStarSwitch(event, item)}>
            <f7-icon slot="media" material={item.star ? 'star_border' : 'star'}></f7-icon>
            {<div slot="title">{this.$text(item.star ? 'Unstar' : 'Star')}</div>}
          </div>
        );
        const domLeftLabel = (
          <div color="blue" propsOnPerform={event => this.onLabel(event, item)}>
            <f7-icon slot="media" material="label"></f7-icon>
            {<div slot="title">{this.$text('Labels')}</div>}
          </div>
        );
        domLeft = (
          <div slot="left">
            {domLeftStar}
            {domLeftLabel}
          </div>
        );
      }
      // domRight
      const domActions = [];
      if (item && item._actions) {
        for (let index in item._actions) {
          index = parseInt(index);
          const action = item._actions[index];
          const _action = this.getAction(action);
          domActions.push(
            <div key={action.id} color={this._getActionColor(action, index)} propsOnPerform={event => this.onAction(event, item, action)}>
              <f7-icon slot="media" material={_action.icon.material}></f7-icon>
              {<div slot="title">{this._getActionTitle(action, item)}</div>}
            </div>
          );
        }
      }
      const domRight = (
        <div slot="right" ready={item && !!item._actions}>
          {domActions}
        </div>
      );
      return (
        <eb-context-menu mode="menu">
          {domLeft}
          {domRight}
        </eb-context-menu>
      );
    },
    _renderTable() {
      return (
        <a-table
          bordered
          rowSelection={this.rowSelection}
          columns={this.columns}
          rowKey={item => item.atomId}
          dataSource={this.layout.dataSource}
          loading={this.layout.loading}
          pagination={false}
          scroll={{ y: this.tableHeight }}
          onChange={this.onTableChange}
          customRow={this._customRow}
        >
        </a-table>
      );
    },
  },
  render() {
    return (
      <div class="atom-list-layout-table-container" >
        {this._renderTable()}
        {this._renderListItemContextMenu()}
      </div>
    );
  },
};
