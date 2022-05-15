export default {
  data() {
    return {
      base: {
        configAppMineBase: null,
      },
    };
  },
  computed: {
    base_ready() {
      return this.base.ready;
    },
    base_userAgent() {
      return this.$store.state.auth.user.agent;
    },
    base_inAgent() {
      return this.base_user.id !== this.base_userAgent.id;
    },
  },
  methods: {
    async base_onInit() {},
  },
};
