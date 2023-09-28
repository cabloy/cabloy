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
    async _addUserRole(roleId) {
      await this.$api.post('user/addUserRole', { key: this.userKey, roleId });
      // reload
      this.reload();
      // toast
      this.$view.toast.show({ text: this.$text('Operation Succeeded') });
    },
    onPerformAdd() {
      this.$view.navigate('/a/baseadmin/role/select', {
        target: '_self',
        context: {
          params: {
            roleIdStart: null,
            multiple: false,
            leafOnly: true,
            roleTypes: [0, 1, 2, 3, 4, 7],
          },
          callback: (code, role) => {
            if (code === 200) {
              this._addUserRole(role.itemId);
            }
          },
        },
      });
    },
    async onPerformDelete(event, item) {
      await this.$view.dialog.confirm();
      // remove
      const roleId = item.itemId;
      await this.$api.post('user/deleteUserRole', {
        key: this.userKey,
        roleId,
      });
      // remove
      const index = this.items.findIndex(item => item.itemId === roleId);
      if (index > -1) this.items.splice(index, 1);
      // swipeoutDelete
      this.$meta.util.swipeoutDelete(event.currentTarget);
      return true;
    },
    async onPerformItem(event, item) {
      const action = {
        actionModule: 'a-base',
        actionComponent: 'action',
        name: 'read',
        navigateOptions: {
          target: '_self',
        },
      };
      await this.$meta.util.performAction({ ctx: this, action, item });
    },
    _renderList() {
      const children = [];
      for (const item of this.items) {
        children.push(
          <eb-list-item
            class="item"
            key={item.userRoleId}
            title={item.atomNameLocale || item.roleName}
            link="#"
            propsOnPerform={event => this.onPerformItem(event, item)}
            swipeout
          >
            <f7-icon slot="media" f7={item._roleTypeCodeOptions.icon.f7}></f7-icon>
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
