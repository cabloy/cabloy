export default {
  computed: {
    modulesAll() {
      return this.$store.getState('a/base/modules');
    },
  },
  created() {
    this.$store.dispatch('a/base/getModules');
  },
  methods: {
    getModule(module) {
      return this.modulesAll ? this.modulesAll[module] : null;
    },
  },
};
