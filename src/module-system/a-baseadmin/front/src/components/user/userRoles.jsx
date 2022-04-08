export default {
  props: {
    userAtomId: {
      type: Number,
    },
    userId: {
      type: Number,
    },
  },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    userKey() {
      return { atomId: this.userAtomId, itemId: this.userId };
    },
  },
  methods: {
    reload(force) {
      this.$refs.loadMore.reload(force);
    },
    loadMore() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear(done) {
      this.items = [];
      done();
    },
    async onLoadMore({ index }) {
      const data = await this.$api.post('user/userRoles', { key: this.userKey, page: { index } });
      this.items = this.items.concat(data.list);
      return data;
    },
    onPerformAdd() {
      this.$view.navigate('/a/baseadmin/role/select', {
        target: '_self',
        context: {
          params: {
            roleIdStart: null,
            multiple: false,
            leafOnly: true,
          },
          callback: (code, role) => {
            if (code === 200) {
              const roleId = role.itemId;
              this.$api.post('user/addRole', { userId: this.user.id, roleId }).then(() => {
                this.$meta.eventHub.$emit('user:addRole', { userId: this.user.id, roleId });
                this.reload();
                this.$view.toast.show({ text: this.$text('Operation Succeeded') });
              });
            }
          },
        },
      });
    },
    onPerformDelete(event, item) {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('user/removeRole', { id: item.id }).then(() => {
          this.onRoleDelete({ roleId: item.roleId });
          this.$meta.eventHub.$emit('user:removeRole', { userId: this.user.id, roleId: item.roleId });
          this.$meta.util.swipeoutDelete(event.currentTarget);
          return true;
        });
      });
    },
    onRoleSave(data) {
      const index = this.items.findIndex(item => item.roleId === data.roleId);
      if (index > -1) this.reload();
    },
    onRoleDelete(data) {
      const index = this.items.findIndex(item => item.roleId === data.roleId);
      if (index > -1) this.items.splice(index, 1);
    },
    _renderList() {
      const children = [];
      for (const item of this.items) {
        children.push(
          <eb-list-item
            class="item"
            key={item.id}
            title={item.roleNameLocale || item.roleName}
            link="#"
            propsOnPerform={event => this.onPerformItem(event, item)}
            swipeout
          >
            <eb-context-menu>
              <div slot="right">
                <div color="red" propsOnPerform={event => this.onPerformDelete(event, item)}>
                  {this.$text('Remove')}
                </div>
              </div>
            </eb-context-menu>
          </eb-list-item>
        );
      }
      return <f7-list>{children}</f7-list>;
    },
  },
  render() {
    return (
      <div>
        {this._renderList()}
        <eb-load-more
          ref="loadMore"
          propsOnLoadClear={this.onLoadClear}
          propsOnLoadMore={this.onLoadMore}
          autoInit={true}
        ></eb-load-more>
      </div>
    );
  },
};
