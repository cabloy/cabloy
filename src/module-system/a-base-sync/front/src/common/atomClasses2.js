export default {
  methods: {
    // id/module+atomClassName
    async sys_getAtomClassBase({ atomClass }) {
      return await this.$store.dispatch('a/base/getAtomClassBase', {
        atomClass,
      });
    },
    sys_getAtomClassBaseSync({ atomClass }) {
      const key = atomClass.id || `${atomClass.module}:${atomClass.atomClassName}`;
      const atomClassBases = this.$store.getState('a/base/atomClassBases');
      return atomClassBases[key];
    },
  },
};
