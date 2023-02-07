export default {
  props: {
    roleAtomId: {
      type: Number,
    },
    roleId: {
      type: Number,
    },
  },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    roleKey() {
      return { atomId: this.roleAtomId, itemId: this.roleId };
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
      const data = await this.$api.post('role/roleUsers', { key: this.roleKey, page: { index } });
      this.items = this.items.concat(data.list);
      return data;
    },
    async onPerformDelete(event, item) {
      await this.$view.dialog.confirm();
      // remove
      const userId = item.itemId;
      await this.$api.post('role/deleteUserRole', {
        key: this.roleKey,
        userId,
      });
      // remove
      const index = this.items.findIndex(item => item.itemId === userId);
      if (index > -1) this.items.splice(index, 1);
      // swipeoutDelete
      this.$meta.util.swipeoutDelete(event.currentTarget);
      return true;
    },
    onPerformAdd() {
      this.$view.navigate('/a/baseadmin/user/select', {
        target: '_self',
        context: {
          params: {},
          callback: (code, selectedUser) => {
            if (code === 200) {
              this._addUserRole(selectedUser.itemId);
            }
          },
        },
      });
    },
    async _addUserRole(userId) {
      await this.$api.post('role/addUserRole', { key: this.roleKey, userId });
      // reload
      this.reload();
      // toast
      this.$view.toast.show({ text: this.$text('Operation Succeeded') });
    },
    getItemMedia(item) {
      return this.$meta.util.combineAvatarUrl(item.avatar, 32);
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
        let domRealName;
        if (item.realName && item.realName !== item.userName) {
          domRealName = <f7-badge>{item.realName}</f7-badge>;
        }
        let domMobile;
        if (item.mobile) {
          domMobile = <f7-badge>{item.mobile}</f7-badge>;
        }
        let domDisabled;
        if (item.disabled === 1) {
          domDisabled = <f7-badge>{this.$text('Disabled')}</f7-badge>;
        }
        children.push(
          <eb-list-item
            class="item"
            key={item.id}
            title={item.userName}
            link="#"
            propsOnPerform={event => this.onPerformItem(event, item)}
            swipeout
          >
            <div slot="media">
              <img class="avatar avatar32" src={this.getItemMedia(item)} />
            </div>
            <div slot="after">
              {domRealName}
              {domMobile}
              {domDisabled}
            </div>
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
