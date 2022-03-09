const __colorsStock = ['#FF3B30', '#FF9500', '#9C27B0', '#009688', '#2196F3', '#4CD964'];
export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    readOnly() {
      const { validate } = this.context;
      return validate.readOnly;
    },
    container() {
      const { validate } = this.context;
      return validate.host.container;
    },
    flowDefId() {
      return this.container.flowDefId;
    },
    nodeId() {
      return this.container.id;
    },
    diagram() {
      // diagram
      return this.container.diagram;
    },
  },
  created() {},
  methods: {
    async onItemClick(event, item) {
      // queries
      const queries = {
        flowDefId: this.flowDefId,
        nodeId: this.nodeId,
        behaviorId: item.id,
      };
      // url
      const url = this.$meta.util.combineQueries('/a/flowchart/flowDef/behaviorEdit', queries);
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            context: this.context,
            readOnly: this.readOnly,
            value: item,
          },
          callback: (code, data) => {
            if (code === 200) {
              const behaviors = this.context.getValue().concat();
              const [index] = this._findBehavior(item.id);
              behaviors[index] = data;
              this.context.setValue(behaviors);
            }
          },
        },
      });
    },
    _findBehavior(behaviorId) {
      const behaviors = this.context.getValue();
      const index = behaviors.findIndex(item => item.id === behaviorId);
      return [index, index === -1 ? null : behaviors[index]];
    },
    async _onActionDelete(event, item) {
      await this.$view.dialog.confirm();
      // delete edges
      this._deleteEdges(item.id);
      // delete behavior
      const behaviors = this.context.getValue();
      const [index] = this._findBehavior(item.id);
      behaviors.splice(index, 1);
      this.context.setValue(behaviors);
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    _deleteEdges(behaviorId) {
      const edgeIds = this.diagram.contentProcess.edges
        .filter(edge => {
          return edge.source === this.nodeId && edge.behavior === behaviorId;
        })
        .map(edge => edge.id);
      this.diagram.deleteEdges(edgeIds);
    },
    _onActionMoveUp(event, item) {
      const behaviors = this.context.getValue();
      const [index] = this._findBehavior(item.id);
      if (index > 0) {
        const item = behaviors.splice(index, 1);
        behaviors.splice(index - 1, 0, item[0]);
        this.context.setValue(behaviors);
      }
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    _onActionMoveDown(event, item) {
      const behaviors = this.context.getValue();
      const [index] = this._findBehavior(item.id);
      if (index < behaviors.length - 1) {
        const item = behaviors.splice(index + 1, 1);
        behaviors.splice(index, 0, item[0]);
        this.context.setValue(behaviors);
      }
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    onSwipeoutOpened(/* event, item*/) {},
    onPerformAdd() {
      this.$view.navigate('/a/flowchart/flowDef/behaviors', {
        target: '_self',
        context: {
          params: {
            diagram: this.diagram,
          },
          callback: (code, data) => {
            if (code === 200) {
              if (data) {
                this._addBehavior(data);
              }
            }
          },
        },
      });
    },
    _addBehavior(behaviorBase) {
      // contentChange
      const behaviors = this.context.getValue() || [];
      // id
      const id = this.__getAvailableBehaviorId(behaviors, behaviorBase);
      // name
      const name = behaviorBase.titleLocale || behaviorBase.title;
      // color
      const color = this.__getAvailableBehaviorColor(behaviors);
      // behavior
      behaviors.push({
        id,
        name,
        type: behaviorBase.type,
        color,
      });
      this.context.setValue(behaviors);
    },
    __getAvailableBehaviorId(behaviors, behaviorBase) {
      let id = 0;
      for (const cell of behaviors) {
        if (!cell.id) continue;
        const _id = parseInt(cell.id.split('_')[1] || 0);
        if (_id > id) {
          id = _id;
        }
      }
      return `${behaviorBase.type}_${id + 1}`;
    },
    __getAvailableBehaviorColor(behaviors) {
      let color;
      for (const colorStock of __colorsStock) {
        if (!behaviors.some(behavior => behavior.color === colorStock)) {
          color = colorStock;
          break;
        }
      }
      if (!color) {
        color = this.__randomColor();
      }
      return color;
    },
    __randomColor() {
      const r = Math.floor(Math.random() * 150 + 50);
      const g = Math.floor(Math.random() * 150 + 50);
      const b = Math.floor(Math.random() * 150 + 50);
      const color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
      return color.toUpperCase();
    },
    _renderBehaviorMedia(item) {
      // behaviorBase
      const behaviorBase = this.diagram.behaviorBases[item.type];
      // icon
      const material = behaviorBase.icon.material;
      const f7 = behaviorBase.icon.f7;
      const url = behaviorBase.icon.url;
      if (material || f7) {
        return <f7-icon style={{ color: item.color }} material={material} f7={f7}></f7-icon>;
      }
      // url
      return (
        <img
          style={{ color: item.color }}
          class="media-node-base-icon"
          src={this.$meta.util.combineFetchStaticPath(url)}
        />
      );
    },
    _renderTitle() {
      let domAdd;
      if (!this.readOnly) {
        domAdd = <eb-link iconF7="::add" propsOnPerform={this.onPerformAdd}></eb-link>;
      }
      return (
        <f7-list-item group-title>
          <div class="display-flex justify-content-space-between">
            <div>{this.$text('Behaviors')}</div>
            {domAdd}
          </div>
        </f7-list-item>
      );
    },
    _renderBehavior(item) {
      // media
      const domMedia = <div slot="media">{this._renderBehaviorMedia(item)}</div>;
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.name}</div>
        </div>
      );
      // ok
      return (
        <eb-list-item
          class="item"
          key={item.id}
          link="#"
          propsOnPerform={event => this.onItemClick(event, item)}
          swipeout
          onSwipeoutOpened={event => {
            this.onSwipeoutOpened(event, item);
          }}
          onContextmenuOpened={event => {
            this.onSwipeoutOpened(event, item);
          }}
        >
          {domMedia}
          {domTitle}
          {this._renderListItemContextMenu(item)}
        </eb-list-item>
      );
    },
    _renderListItemContextMenu(item, mode) {
      if (this.readOnly) return null;
      // domRight: delete/moveUp/moveDown
      const domActions = [];
      // delete
      let domDeleteTitle;
      if (mode === 'menu' || (!mode && this.$device.desktop)) {
        domDeleteTitle = <div slot="title">{this.$text('Delete')}</div>;
      }
      domActions.push(
        <div key="delete" color="red" propsOnPerform={event => this._onActionDelete(event, item)}>
          <f7-icon slot="media" f7="::delete"></f7-icon>
          {domDeleteTitle}
        </div>
      );
      // index
      const behaviors = this.context.getValue();
      const [index] = this._findBehavior(item.id);
      // moveUp
      if (index > 0) {
        let domMoveUpTitle;
        if (mode === 'menu' || (!mode && this.$device.desktop)) {
          domMoveUpTitle = <div slot="title">{this.$text('Move Up')}</div>;
        }
        domActions.push(
          <div key="moveUp" color="teal" propsOnPerform={event => this._onActionMoveUp(event, item)}>
            <f7-icon slot="media" f7="::arrow-up"></f7-icon>
            {domMoveUpTitle}
          </div>
        );
      }
      // moveDown
      if (index < behaviors.length - 1) {
        let domMoveDownTitle;
        if (mode === 'menu' || (!mode && this.$device.desktop)) {
          domMoveDownTitle = <div slot="title">{this.$text('Move Down')}</div>;
        }
        domActions.push(
          <div key="moveDown" color="teal" propsOnPerform={event => this._onActionMoveDown(event, item)}>
            <f7-icon slot="media" f7="::arrow-down"></f7-icon>
            {domMoveDownTitle}
          </div>
        );
      }
      // right
      const domRight = <div slot="right">{domActions}</div>;
      return <eb-context-menu mode={mode}>{domRight}</eb-context-menu>;
    },
    _renderBehaviors() {
      const children = [];
      const behaviors = this.context.getValue();
      if (!behaviors) return null;
      for (const behavior of behaviors) {
        children.push(this._renderBehavior(behavior));
      }
      return children;
    },
  },
  render() {
    return (
      <div>
        {this._renderTitle()}
        {this._renderBehaviors()}
      </div>
    );
  },
};
