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
    onLoadMore({ index }) {
      return this.$api.post('role/includes', { roleId: this.role.id, page: { index } }).then(data => {
        this.items = this.items.concat(data.list);
        return data;
      });
    },
    onPerformAdd() {
      this.$view.navigate('/a/baseadmin/role/select', {
        target: '_self',
        context: {
          params: {
            roleIdStart: null,
            multiple: false,
          },
          callback: (code, data) => {
            if (code === 200) {
              this.$api.post('role/addRoleInc', { roleId: this.role.id, roleIdInc: data.id }).then(data => {
                this.$meta.eventHub.$emit('role:dirty', { dirty: true });
                this.reload();
                this.$view.toast.show({ text: this.$text('Operation Succeeded') });
              });
            }
          },
        },
      });
    },
    onRemove(event, item) {
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
