export default {
  props: {
    readOnly: {
      type: Boolean,
    },
    assignees: {
      type: Object,
    },
    host: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    onPerformAdd() {
      this.$view.navigate('/a/baseadmin/user/select', {
        target: '_self',
        context: {
          params: {
            onFetchUsers: ({ query, page }) => {
              return this.$api.post('/a/flowchart/flowDef/userSelect', {
                host: this.host,
                params: {
                  query,
                  page,
                },
              });
            },
          },
          callback: (code, data) => {
            if (code === 200) {
              const _user = this.assignees.users.find(item => item.id === data.id);
              if (!_user) {
                this.assignees.users.push(data);
              }
            }
          },
        },
      });
    },
    onPerformRemove(event, item, index) {
      this.assignees.users.splice(index, 1);
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    getItemMedia(item) {
      return this.$meta.util.combineAvatarUrl(item.avatar, 32);
    },
    _renderAssignee(item, index) {
      // domMedia
      const domMedia = (
        <div slot="media">
          <img class="avatar avatar32" src={this.getItemMedia(item)} />
        </div>
      );
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.userName}</div>
        </div>
      );
      // domAfter
      let domAfterRealName;
      if (item.realName && item.realName !== item.userName) {
        domAfterRealName = <f7-badge>{item.realName}</f7-badge>;
      }
      let domAfterMobile;
      if (item.mobile) {
        domAfterMobile = <f7-badge>{item.mobile}</f7-badge>;
      }
      const domAfter = (
        <div slot="after">
          {domAfterRealName}
          {domAfterMobile}
        </div>
      );
      // ok
      //   key: not use item.name
      return (
        <eb-list-item class="item" key={index} swipeout={!this.readOnly}>
          {domMedia}
          {domTitle}
          {domAfter}
          {this._renderAssigneeContextMenu(item, index)}
        </eb-list-item>
      );
    },
    _renderAssigneeContextMenu(item, index) {
      if (this.readOnly) return null;
      // domRight
      const domActions = [];
      domActions.push(
        <div key="remove" color="red" propsOnPerform={event => this.onPerformRemove(event, item, index)}>
          <f7-icon slot="media" f7="::delete"></f7-icon>
          {this.$device.desktop && <div slot="title">{this.$text('Remove')}</div>}
        </div>
      );
      const domRight = <div slot="right">{domActions}</div>;

      return <eb-context-menu>{domRight}</eb-context-menu>;
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
    let domAdd;
    if (!this.readOnly) {
      domAdd = <eb-link iconF7="::add" propsOnPerform={this.onPerformAdd}></eb-link>;
    }
    return (
      <f7-list-group>
        <f7-list-item group-title>
          <div class="display-flex justify-content-space-between">
            <div>{this.$text('Users')}</div>
            {domAdd}
          </div>
        </f7-list-item>
        {this.renderAssignees()}
      </f7-list-group>
    );
  },
};
