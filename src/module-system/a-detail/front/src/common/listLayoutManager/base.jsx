export default {
  data() {
    return {
      base: {
        ready: false,
        configDetailBase: null,
        configDetail: null,
      },
    };
  },
  computed: {
    base_user() {
      return this.$store.state.auth.user.op;
    },
  },
  created() {},
  methods: {
    async base_init() {
      // layoutConfig
      await this.layout_initLayoutConfig();
      // load detailClasses
      await this.$store.dispatch('a/base/getDetailClasses');
    },
    base_prepareReadOptions() {
      // options
      const options = {};
      // layout
      options.layout = this.layout.current;
      // options
      return options;
    },
    base_prepareSelectOptions() {
      // options
      let options = {
        where: {},
      };
      // layout
      options.layout = this.layout.current;
      // order
      options.orders = null;
      // extend 1
      if (this.container.options) {
        options = this.$utils.extend({}, options, this.container.options);
      }
      // options
      return options;
    },
    base_prepareSelectParams() {
      // options
      const options = this.base_prepareSelectOptions();
      // params
      const params = {
        flowTaskId: this.container.flowTaskId,
        atomKey: { atomId: this.container.atomId },
        detailClass: this.container.detailClass,
        options,
      };
      // ok
      return params;
    },
    base_getItems() {
      return this.layout.instance ? this.layout.instance.getItems() : [];
    },
  },
};
