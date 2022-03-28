import roleList from '../../components/role/list.jsx';
export default {
  components: {
    roleList,
  },
  data() {
    return {
      roleIdStart: parseInt(this.$f7route.query.roleIdStart),
      roleDirty: false,
    };
  },
  computed: {
    tree() {
      return this.$refs.roleList.tree;
    },
  },
  mounted() {
    this.$meta.eventHub.$on('role:save', this.onRoleSave);
    this.$meta.eventHub.$on('role:add', this.onRoleAdd);
    this.$meta.eventHub.$on('role:move', this.onRoleMove);
    this.$meta.eventHub.$on('role:delete', this.onRoleDelete);
    this.$meta.eventHub.$on('role:dirty', this.onRoleDirty);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('role:save', this.onRoleSave);
    this.$meta.eventHub.$off('role:add', this.onRoleAdd);
    this.$meta.eventHub.$off('role:move', this.onRoleMove);
    this.$meta.eventHub.$off('role:delete', this.onRoleDelete);
    this.$meta.eventHub.$off('role:dirty', this.onRoleDirty);
  },
  created() {
    this.checkRoleDirty();
  },
  methods: {
    onNodeClick(node) {
      this.$view.navigate(`/a/baseadmin/role/edit?roleId=${node.id}`);
    },
    reloadNode(node) {
      if (!node) return;
      this.tree.reloadNode(node);
    },
    onRoleSave(data) {
      const node = this.tree.find(null, node => node.id === data.roleIdParent);
      this.reloadNode(node);
    },
    onRoleAdd(data) {
      const node = this.tree.find(null, node => node.id === data.roleIdParent);
      this.reloadNode(node);
    },
    onRoleMove(data) {
      for (const roleIdParent of ['roleIdFrom', 'roleIdTo']) {
        const node = this.tree.find(null, node => node.id === data[roleIdParent]);
        this.reloadNode(node);
      }
    },
    onRoleDelete(data) {
      const node = this.tree.find(null, node => node.id === data.roleId);
      if (node) this.tree.removeNode(node);
    },
    onRoleDirty(data) {
      this.roleDirty = data.dirty;
    },
    async onPerformBuild() {
      const data = await this.$api.post('role/build');
      const progressId = data.progressId;
      await this.$view.dialog.progressbar({ progressId, title: this.$text('Build') });
      this.roleDirty = false;
    },
    async checkRoleDirty() {
      this.roleDirty = await this.$api.post('role/dirty');
    },
    _renderTab() {
      if (!this.roleDirty) return null;
      return (
        <f7-fab color="pink">
          <f7-icon f7="::add"></f7-icon>
          <f7-icon f7="::close"></f7-icon>
          <f7-fab-buttons>
            <eb-fab-button color="orange" propsOnPerform={this.onPerformBuild}>
              {this.$text('Build')}
            </eb-fab-button>
          </f7-fab-buttons>
        </f7-fab>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('Role Management')} eb-back-link="Back"></eb-navbar>
        <role-list ref="roleList" roleIdStart={this.roleIdStart} onNodeClick={this.onNodeClick}></role-list>
        {this._renderTab()}
      </eb-page>
    );
  },
};
