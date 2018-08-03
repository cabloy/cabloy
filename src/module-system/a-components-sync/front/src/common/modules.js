export default {
  meta: {
    component: false,
  },
  data() {
    return {
      moduleBase: null,
    };
  },
  computed: {
    modulesAll() {
      return this.moduleBase ? this.$store.state.a.base.modules : null;
    },
  },
  created() {
    this.$meta.module.use('a-base', module => {
      this.moduleBase = module;
      this.$store.dispatch('a/base/getModules');
    });
  },
  methods: {
    getModule(module) {
      return this.modulesAll ? this.modulesAll[module] : null;
    },
  },
};
