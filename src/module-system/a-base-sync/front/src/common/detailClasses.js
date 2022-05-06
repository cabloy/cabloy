/** @module a-base/front/mixins/ebDetailClasses */

/** ebAtomClasses
 */
export default {
  /**
   * @property {object} atomClassesAll - get all atomClasses
   */
  computed: {
    atomClassesAll() {
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
  },
  created() {
    this.$store.dispatch('a/base/getAtomClasses').then(() => {
      this.onAtomClassesReady && this.onAtomClassesReady();
    });
  },
};
