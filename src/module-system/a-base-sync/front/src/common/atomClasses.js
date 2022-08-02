/** @module a-base/front/mixins/ebAtomClasses */

/** ebAtomClasses
 */
export default {
  /**
   * @property {object} atomClassesAll - get all atomClasses
   */
  computed: {
    atomClasses_modeUser() {
      return false;
    },
    atomClassesAll() {
      if (this.atomClasses_modeUser) return this.$store.getState('a/base/atomClassesUser');
      return this.$store.getState('a/base/atomClasses');
    },
  },
  methods: {
    /**
     * @function getAtomClass
     * @param {object} atomClass
     * @return {object}
     */
    getAtomClass(atomClass) {
      if (!this.atomClassesAll || !atomClass) return null;
      return this.atomClassesAll[atomClass.module][atomClass.atomClassName];
    },
    async atomClasses_loadAtomClasses() {
      if (this.atomClasses_modeUser) {
        await this.$store.dispatch('a/base/getAtomClassesUser');
      } else {
        await this.$store.dispatch('a/base/getAtomClasses');
      }
      this.onAtomClassesReady && this.onAtomClassesReady();
    },
  },
  created() {
    this.atomClasses_loadAtomClasses();
  },
};
