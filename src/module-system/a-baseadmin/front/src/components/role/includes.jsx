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
          },
          callback: (code, data) => {
            if (code === 200) {
              this._addRoleInc(data.id);
            }
          },
        },
      });
    },
    onPerformRemove(event, item) {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('role/removeRoleInc', { id: item.id }).then(() => {
          this.onRoleDelete({ roleId: item.roleIdInc });
          this.$meta.eventHub.$emit('role:dirty', { dirty: true });
          this.$meta.util.swipeoutDelete(event.currentTarget);
          return true;
        });
      });
    },
    _renderList() {
      const children = [];
      for (const item of this.items) {
        children.push(
          <eb-list-item class="item" key={item.id} title={item.atomNameLocale || item.roleName} link="#" swipeout>
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
