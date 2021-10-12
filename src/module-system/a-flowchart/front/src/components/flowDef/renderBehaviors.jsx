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
    async onItemClick(event, item) {
      return this.layoutManager.data.adapter.item_onItemClick(event, item);
    },
    onSwipeoutOpened(/* event, item*/) {},
    onPerformAdd() {
      this.$view.navigate('/a/baseadmin/role/select', {
        target: '_self',
        context: {
          params: {
            roleIdStart: null,
            multiple: true,
            onFetchChildren: ({ roleId }) => {
              return this.$api.post('/a/flowchart/flowDef/roleChildren', {
                host: this.host,
                params: {
                  roleId,
                  page: { size: 0 },
                },
              });
            },
          },
          callback: (code, data) => {
            if (code === 200) {
              if (data) {
                const roles = data.map(item => item.data);
                for (const role of roles) {
                  const _role = this.assignees.roles.find(item => item.id === role.id);
                  if (!_role) {
                    // eslint-disable-next-line
                    this.assignees.roles.push(role);
                  }
                }
              }
            }
          },
        },
      });
    },
    _getBehaviorMedia(item) {
      const { validate } = this.context;
      // container
      const container = validate.host.container;
      // diagram
      const diagram = container.diagram;
      // behaviorBase
      const behaviorBase = diagram.behaviorBases[item.type];
      // icon
      if (behaviorBase.icon.material) {
        return <f7-icon material={behaviorBase.icon.material}></f7-icon>;
      }
      // url
      return <img class="media-node-base-icon" src={this.$meta.util.combineFetchStaticPath(behaviorBase.icon)} />;
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
