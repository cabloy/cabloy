export default {
  methods: {
    async sys_getActionsBase({ atomClass }) {
      return await this.$store.dispatch('a/base/getActionsBase', {
        atomClass,
      });
    },
    sys_getActionsBaseSync({ atomClass }) {
      const key = `${atomClass.module}:${atomClass.atomClassName}`;
      const actionsBases = this.$store.getState('a/base/actionsBases');
      return actionsBases[key];
    },
    async sys_getActionBase({ atomClass, code, name }) {
      return await this.$store.dispatch('a/base/getActionBase', {
        atomClass,
        code,
        name,
      });
    },
    sys_getActionBaseSync({ atomClass, code, name }) {
      const actionsBase = this.sys_getActionsBaseSync({ atomClass });
    },
  },
};
