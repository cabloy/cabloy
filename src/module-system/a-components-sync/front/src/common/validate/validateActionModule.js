export default {
  data() {
    return {
      action_modules_loaded: {},
    };
  },
  methods: {
    __action_modules_load(module) {
      this.$meta.module.use(module, () => {
        this.$set(this.action_modules_loaded, module, true);
      });
    },
    __action_modules_get(module) {
      return this.action_modules_loaded[module];
    },
  },
};
