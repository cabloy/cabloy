export default {
  meta: {
    component: false,
  },
  computed: {
    atomClassesAll() {
      return this.$store.state.a.base.atomClasses;
    },
  },
  methods: {
    getAtomClass(atomClass) {
      if (!this.atomClassesAll || !atomClass) return null;
      return this.atomClassesAll[atomClass.module][atomClass.atomClassName];
    },
  },
  created() {
    this.$meta.module.use('a-base', module => {
      this.$store.dispatch('a/base/getAtomClasses');
    });
  },
};

