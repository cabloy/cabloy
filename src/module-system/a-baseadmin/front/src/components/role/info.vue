<template>
  <eb-validate ref="validate" :data="role" :params="{validator: 'role'}" :onPerform="onPerformValidate">
    <f7-list>
      <f7-list-item>
        <f7-label floating>Role name</f7-label>
        <eb-input type="text" placeholder="Role name" :disabled="role.system===1" :clear-button="role.system===0" v-model="role.roleName" dataPath="roleName"></eb-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label floating>Sorting</f7-label>
        <eb-input type="text" placeholder="Sorting" clear-button v-model="role.sorting" dataPath="sorting"></eb-input>
      </f7-list-item>
      <f7-list-item>
        <span class="text-color-gray">Leader</span>
        <eb-toggle v-model="role.leader" dataPath="leader"></eb-toggle>
      </f7-list-item>
      <f7-list-item>
        <span class="text-color-gray">Catalog</span>
        <eb-toggle :value="role.catalog" disabled dataPath="catalog"></eb-toggle>
      </f7-list-item>
      <f7-list-item>
        <span class="text-color-gray">System</span>
        <eb-toggle :value="role.system" disabled dataPath="system"></eb-toggle>
      </f7-list-item>
    </f7-list>
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
                  .then(data => {
                    this.$meta.eventHub.$emit('role:move', { roleId: this.role.id, roleIdFrom: this.role.roleIdParent, roleIdTo: roleIdParent });
                    this.$meta.eventHub.$emit('role:dirty', { dirty: true });
                    this.$view.toast.show({ text: this.$text('Operation succeeded') });
                  });
              }
            }
          },
        },
      });
    },
    onPerformDelete() {
      return this.$view.dialog.confirm(this.$text('Are you sure to perform this operation?'))
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
