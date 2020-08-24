<template>
  <eb-validate ref="validate" :data="role" :params="{validator: 'role'}" :onPerform="onPerformValidate">
    <eb-list form inline-labels no-hairlines-md>
      <eb-list-input type="text" :disabled="role.system===1" :clear-button="role.system===0" :placeholder="$text('Role Name')" v-model="role.roleName" dataPath="roleName">
        <div slot="label" class="text-color-gray">{{$text('Role Name')}}</div>
      </eb-list-input>
      <eb-list-input :label="$text('Sorting')" type="text" clear-button :placeholder="$text('Sorting')" v-model="role.sorting" dataPath="sorting">
      </eb-list-input>
      <f7-list-item :title="$text('Leader')">
        <eb-toggle v-model="role.leader" dataPath="leader"></eb-toggle>
      </f7-list-item>
      <f7-list-item>
        <span class="text-color-gray">{{$text('Catalog')}}</span>
        <eb-toggle :value="role.catalog" disabled dataPath="catalog"></eb-toggle>
      </f7-list-item>
      <f7-list-item>
        <span class="text-color-gray">{{$text('System')}}</span>
        <eb-toggle :value="role.system" disabled dataPath="system"></eb-toggle>
      </f7-list-item>
    </eb-list>
  </eb-validate>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  props: {
    role: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    onPerformValidate() {
      return this.$api.post('role/save', {
        roleId: this.role.id,
        data: this.role,
      }).then(() => {
        this.$meta.eventHub.$emit('role:save', { roleId: this.role.id, roleIdParent: this.role.roleIdParent, role: this.role });
        return true;
      });
    },
    onPerformSave() {
      return this.$refs.validate.perform();
    },
    onPerformMove() {
      this.$view.navigate('/a/baseadmin/role/select', {
        target: '_self',
        context: {
          params: {
            roleIdStart: null,
            multiple: false,
            roleIdDisable: this.role.id,
            catalogOnly: true,
          },
          callback: (code, data) => {
            if (code === 200) {
              const roleIdParent = data.id;
              if (this.role.roleIdParent !== roleIdParent) {
                this.$api.post('role/move', { roleId: this.role.id, roleIdParent })
                  .then(() => {
                    this.$meta.eventHub.$emit('role:move', { roleId: this.role.id, roleIdFrom: this.role.roleIdParent, roleIdTo: roleIdParent });
                    this.$meta.eventHub.$emit('role:dirty', { dirty: true });
                    this.$view.toast.show({ text: this.$text('Operation Succeeded') });
                  });
              }
            }
          },
        },
      });
    },
    onPerformDelete() {
      return this.$view.dialog.confirm()
        .then(() => {
          return this.$api.post('role/delete', { roleId: this.role.id })
            .then(() => {
              this.$meta.eventHub.$emit('role:delete', { roleId: this.role.id, roleIdParent: this.role.roleIdParent });
              this.$meta.eventHub.$emit('role:dirty', { dirty: true });
              this.$f7router.back();
            });
        });
    },
  },
};

</script>
