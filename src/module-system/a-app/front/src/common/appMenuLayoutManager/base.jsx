export default {
  data() {
    return {
      base: {
        ready: false,
      },
    };
  },
  methods: {
    async base_init() {
      // layoutConfig
      await this.layoutBase_initLayoutConfig();
    },
  },
};
