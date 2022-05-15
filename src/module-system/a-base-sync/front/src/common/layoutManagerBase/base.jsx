export default {
  data() {
    return {
      base: {
        ready: false,
        notfound: false,
      },
    };
  },
  computed: {
    base_user() {
      return this.$store.state.auth.user.op;
    },
  },
  methods: {
    async base_init() {
      // layoutConfig
      await this.layout_initLayoutConfig();
      // base_onInit
      if (this.base_onInit) {
        await this.base_onInit();
      }
    },
  },
};
