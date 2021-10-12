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
    ebOptions() {
      const { validate } = this.context;
      // container
      const container = validate.host.container;
      // diagram
      const diagram = container.diagram;
      // nodeId
      const nodeId = container.id;
      // filter
      const nodes = diagram.contentProcess.nodes
        .filter(item => {
          return item.id !== nodeId && (item.type === 'startEventAtom' || item.type === 'activityUserTask');
        })
        .map(item => {
          return {
            title: item.nameLocale || item.name,
            value: item.id,
          };
        });
      // default
      nodes.unshift({ title: 'Default', value: '' });
      // ok
      return nodes;
    },
  },
  created() {},
  methods: {
    getDiagram() {
      const { validate } = this.context;
      // container
      const container = validate.host.container;
      // diagram
      return container.diagram;
    },
    async onItemClick(event, item) {
      return this.layoutManager.data.adapter.item_onItemClick(event, item);
    },
    onSwipeoutOpened(/* event, item*/) {},
    onPerformAdd() {
      // diagram
      const diagram = this.getDiagram();
      this.$view.navigate('/a/flowchart/flowDef/behaviors', {
        target: '_self',
        context: {
          params: {
            diagram,
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
      // behavior
      behaviors.push({
        id,
        name,
        type: behaviorBase.type,
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
    _getBehaviorMedia(item) {
      // diagram
      const diagram = this.getDiagram();
      // behaviorBase
      const behaviorBase = diagram.behaviorBases[item.type];
      // icon
      if (behaviorBase.icon.material) {
        return <f7-icon color={item.color} material={behaviorBase.icon.material}></f7-icon>;
      }
      // url
      return (
        <img
          style={{ color: item.color }}
          class="media-node-base-icon"
          src={this.$meta.util.combineFetchStaticPath(behaviorBase.icon)}
        />
      );
    },
    _renderTitle() {
      const { validate } = this.context;
      const { readOnly } = validate;
      let domAdd;
      if (!readOnly) {
        domAdd = <eb-link iconMaterial="add" propsOnPerform={this.onPerformAdd}></eb-link>;
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
      const domMedia = <div slot="media">{this._getBehaviorMedia(item)}</div>;
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
    _renderListItemContextMenu(item) {
      return null;
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
