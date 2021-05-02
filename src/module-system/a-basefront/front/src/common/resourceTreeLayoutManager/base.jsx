export default {
  data() {
    return {
      base: {
        ready: false,
        configResourceBase: null,
        config: null,
      },
    };
  },
  computed: {
    base_user() {
      return this.$store.state.auth.user.op;
    },
  },
  created() {
  },
  methods: {
    base_prepareSelectOptions() {
      // options
      let options = {
        where: { },
      };
      // layout
      options.layout = this.layout.current;
      // order
      options.orders = [
        [ 'a.updatedAt', 'desc' ],
      ];
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
        options,
      };
      return params;
    },
    base_getItems() {
      return this.layout.instance ? this.layout.instance.getItems() : [];
    },
  },
};
