/** @module a-base/front/mixins/ebDetailClasses */

/** ebDetailClasses
 */
export default {
  /**
   * @property {object} detailClassesAll - get all detailClasses
   */
  computed: {
    detailClassesAll() {
      return this.$store.getState('a/base/detailClasses');
    },
  },
  methods: {
    /**
     * @function getDetailClass
     * @param {object} detailClass
     * @return {object}
     */
    getDetailClass(detailClass) {
      if (!this.detailClassesAll || !detailClass) return null;
      return this.detailClassesAll[detailClass.module][detailClass.detailClassName];
    },
  },
  created() {
    this.$store.dispatch('a/base/getDetailClasses').then(() => {
      this.onDetailClassesReady && this.onDetailClassesReady();
    });
  },
};
