<template>
  <eb-validate
    ref="validate"
    auto
    :data="role"
    :params="{ module: 'a-base', validator: 'role' }"
    :onPerform="onPerformValidate"
  >
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
      return this.$api
        .post('role/save', {
          roleId: this.role.id,
          data: this.role,
        })
        .then(() => {
          this.$meta.eventHub.$emit('role:save', {
            roleId: this.role.id,
            roleIdParent: this.role.roleIdParent,
            role: this.role,
          });
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
                this.$api.post('role/move', { roleId: this.role.id, roleIdParent }).then(() => {
                  this.$meta.eventHub.$emit('role:move', {
                    roleId: this.role.id,
                    roleIdFrom: this.role.roleIdParent,
                    roleIdTo: roleIdParent,
                  });
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
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('role/delete', { roleId: this.role.id }).then(() => {
          this.$meta.eventHub.$emit('role:delete', { roleId: this.role.id, roleIdParent: this.role.roleIdParent });
          this.$meta.eventHub.$emit('role:dirty', { dirty: true });
          this.$f7router.back();
        });
      });
    },
  },
};
</script>
