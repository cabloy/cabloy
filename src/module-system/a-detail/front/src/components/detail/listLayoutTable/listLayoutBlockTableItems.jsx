import Vue from 'vue';
const ebDetailActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebDetailActions;
export default {
  meta: {
    global: false,
  },
  mixins: [ ebDetailActions ],
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
        // sorter
        _column.sorter = !!this._columnSorterFind(_column.dataIndex);
        _column.sortOrder = this._columnSorterCurrent(_column.dataIndex);
        // push
        _columns.push(_column);
      }
      return _columns;
    },
  },
  mounted() {
    this.$meta.eventHub.$on('detail:action', this.onActionChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('detail:action', this.onActionChanged);
  },
  methods: {
    async onItemClick(event, item) {
      return await this.onAction(event, item, {
        module: item.module,
        detailClassName: item.detailClassName,
        name: 'read',
      });
    },
    onSwipeoutOpened(event, item) {
    },
    async onAction(event, item, action) {
      const _action = this.getDetailAction(action);
      if (!_action) return;
      const res = await this.$meta.util.performAction({ ctx: this, action: _action, item });
      this.$meta.util.swipeoutClose(event.target);
      return res;
    },
    onActionChanged(data) {
      const { atomKey, detailClass } = data;
      if (
        atomKey.atomId !== this.layoutManager.container.atomId ||
        detailClass.module !== this.layoutManager.container.detailClass.module ||
        detailClass.detailClassName !== this.layoutManager.container.detailClass.detailClassName
      ) return;

      const key = data.key;
      const action = data.action;
      // create
      if (action.name === 'create') {
        // load
        this.layout.loadDetails();
        return;
      }
      // delete
      const { items, index } = this.layout._findItem(key.detailId);
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
        this.$api.post('/a/detail/detail/read', {
          key,
          options,
        }).then(data => {
          Vue.set(items, index, data);
        });
      }
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
      let flags = (item._meta && item._meta.flags) || [];
      if (!Array.isArray(flags)) flags = flags.split(',');
      if (item.atomDisabled) {
        flags = [ this.$text('Disabled') ].concat(flags);
      }
      return flags;
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
    _checkColumnNameEqualOrder(atomOrder, columnName) {
      const key = this.layoutManager.order_getKey(atomOrder);
      return (key === `a.${columnName}` || key === `f.${columnName}` || key === columnName);
    },
    _columnSorterFind(columnName) {
      return this.layoutManager.order_list.find(atomOrder => {
        return this._checkColumnNameEqualOrder(atomOrder, columnName);
      });
    },
    _columnSorterCurrent(columnName) {
      const atomOrderCurrent = this.layoutManager.order_current;
      const key = this.layoutManager.order_getKey(atomOrderCurrent);
      if (this._checkColumnNameEqualOrder(atomOrderCurrent, columnName)) {
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
            {<div slot="title">{this.$text(item.star ? 'Unstar' : 'UserStar')}</div>}
          </div>
        );
        const domLeftLabel = (
          <div color="blue" propsOnPerform={event => this.onLabel(event, item)}>
            <f7-icon slot="media" material="label"></f7-icon>
            {<div slot="title">{this.$text('UserLabels')}</div>}
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
    return null;
    return (
      <div class="atom-list-layout-table-container" >
        {this._renderTable()}
        {this._renderListItemContextMenu()}
      </div>
    );
  },
};
