export default {
  props: {
    assignees: {
      type: Object,
    },
    host: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  methods: {
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
                const users = data.map(item => item.data);
                for (const user of users) {
                  const _user = this.assignees.users.find(item => item.id === user.id);
                  if (!_user) {
                    this.assignees.users.push(user);
                  }
                }
              }
            }
          },
        },
      });
    },
    onPerformRemove(event, item, index) {
      this.assignees.users.splice(index, 1);
      this.$meta.util.swipeoutClose(event.target);
    },
    _renderAssignee(item, index) {
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.roleName}</div>
        </div>
      );
      // ok
      //   key: not use item.name
      return (
        <eb-list-item class="item" key={index} swipeout>
          {domTitle}
          {this._renderAssigneeContextMenu(item, index)}
        </eb-list-item>
      );
    },
    _renderAssigneeContextMenu(item, index) {
      // domRight
      const domActions = [];
      domActions.push(
        <div key='remove' color='red' propsOnPerform={event => this.onPerformRemove(event, item, index)}>
          <f7-icon slot="media" material='delete'></f7-icon>
          {this.$device.desktop && <div slot="title">{this.$text('Remove')}</div>}
        </div>
      );
      const domRight = (
        <div slot="right">
          {domActions}
        </div>
      );

      return (
        <eb-context-menu>
          {domRight}
        </eb-context-menu>
      );
    },
    renderAssignees() {
      const children = [];
      const items = this.assignees.users;
      for (let index = 0; index < items.length; index++) {
        children.push(this._renderAssignee(items[index], index));
      }
      return children;
    },
  },
  render() {
    return (
      <f7-list-group>
        <f7-list-item group-title>
          <div class="display-flex justify-content-space-between">
            <div>{this.$text('Users')}</div>
            <eb-link iconMaterial='add' propsOnPerform={this.onPerformAdd}></eb-link>
          </div>
        </f7-list-item>
        {this.renderAssignees()}
      </f7-list-group>
    );
  },
};

