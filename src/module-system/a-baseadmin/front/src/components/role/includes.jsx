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
      const data = await this.$api.post('role/includes', { key: this.roleKey, page: { index } });
      this.items = this.items.concat(data.list);
      return data;
    },
    async _addRoleInc(roleIdInc) {
      const data = await this.$api.post('role/addRoleInc', { key: this.roleKey, roleIdInc });
      // progress
      const progressId = data.progressId;
      await this.$view.dialog.progressbar({ progressId, title: this.$text('Build') });
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
            roleIdsDisable: [this.roleId],
            roleTypes: [0, 1, 2, 3, 4, 5], // exclude: OpenAuthScope
          },
          callback: (code, role) => {
            if (code === 200) {
              this._addRoleInc(role.itemId);
            }
          },
        },
      });
    },
    async onPerformRemove(event, item) {
      await this.$view.dialog.confirm();
      // remove
      const roleIdInc = item.roleIdInc;
      const data = await this.$api.post('role/removeRoleInc', { key: this.roleKey, roleIdInc });
      // progress
      const progressId = data.progressId;
      await this.$view.dialog.progressbar({ progressId, title: this.$text('Build') });
      // remove
      const index = this.items.findIndex(item => item.roleIdInc === roleIdInc);
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
            key={item.roleIncId}
            title={item.atomNameLocale || item.roleName}
            link="#"
            propsOnPerform={event => this.onPerformItem(event, item)}
            swipeout
          >
            <f7-icon slot="media" f7={item._roleTypeCodeOptions.icon.f7}></f7-icon>
            <eb-context-menu>
              <div slot="right">
                <div color="red" propsOnPerform={event => this.onPerformRemove(event, item)}>
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
