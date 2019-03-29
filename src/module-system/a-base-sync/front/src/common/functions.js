export default {
  meta: {
    component: false,
  },
  computed: {
    functionsAll() {
      return this.$store.getState('a/base/functions');
    },
  },
  methods: {
    getFunction(func) {
      if (!this.functionsAll || !func) return null;
      return this.functionsAll[func.module][func.name];
    },
    getFunctionTitle(func) {
      const _func = this.getFunction(func);
      return _func ? _func.titleLocale : null;
    },
  },
  created() {
    this.$store.dispatch('a/base/getFunctions');
  },
};

