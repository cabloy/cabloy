<template>
  <eb-page ptr @ptr:refresh="onRefresh">
    <eb-navbar large largeTransparent :title="$text('Authorize')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconF7="::add" :onPerform="onPerformAdd"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list>
      <eb-list-item class="item" v-for="item of items" :key="item.id" :title="item.roleNameLocale" swipeout>
        <eb-context-menu>
          <div slot="right">
            <div color="red" :context="item" :onPerform="onPerformRemove">{{ $text('Remove') }}</div>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <div v-if="items && items.length === 0" class="text-align-center">{{ $text('No Data') }}</div>
  </eb-page>
</template>
<script>
export default {
  data() {
    const query = this.$f7route.query;
    const atomId = parseInt(query.atomId);
    return {
      atomId,
      items: null,
    };
  },
  created() {
    this.reload();
  },
  methods: {
    combineAtomClassAndLanguage() {
      const queries = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
      };
      if (this.language) {
        queries.language = this.language;
      }
      return queries;
    },
    onRefresh(done) {
      done();
      this.reload();
    },
    reload() {
      this.$api
        .post('/a/base/resource/resourceRoles', {
          key: { atomId: this.atomId },
        })
        .then(res => {
          this.items = res.list;
        });
    },
    async onPerformAdd() {
      this.$view.navigate('/a/baseadmin/role/select', {
        target: '_self',
        context: {
          params: {
            roleIdStart: null,
            multiple: true,
          },
          callback: (code, roles) => {
            if (code === 200) {
              this._resourceRoleAdd(roles);
            }
          },
        },
      });
    },
    async _resourceRoleAdd(_roles) {
      try {
        if (!_roles || _roles.length === 0) return;
        const roles = _roles.map(item => item.itemId);
        await this.$api.post('/a/base/resource/resourceRoleAdd', {
          key: { atomId: this.atomId },
          data: { roles },
        });
        this.reload();
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    },
    async onItemClick(event, item) {
      await this.onPerformEdit(event, item);
    },
    async onPerformEdit(event, item) {
      const tagName = await this.$view.dialog.prompt(this.$text('Please specify the new tag name'));
      if (!tagName) return;
      await this.$api.post('/a/base/tag/save', {
        tagId: item.id,
        data: {
          tagName,
        },
      });
      const index = this.items.findIndex(_item => _item.id === item.id);
      if (index !== -1) {
        this.items.splice(index, 1, { ...item, tagName });
      }
    },
    async onPerformRemove(event, item) {
      await this.$view.dialog.confirm();
      await this.$api.post('/a/base/resource/resourceRoleRemove', {
        key: { atomId: this.atomId },
        data: {
          roleId: item.roleId,
        },
      });
      this.$meta.util.swipeoutClose(event.currentTarget);
      const index = this.items.findIndex(_item => _item.id === item.id);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
  },
};
</script>
<style lang="less" scoped></style>
