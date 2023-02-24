export default {
  data() {
    return {
      base: {
        configDetailBase: null,
        configDetail: null,
      },
    };
  },
  computed: {},
  methods: {
    async base_onInit() {
      // load detailClasses
      await this.$store.dispatch('a/base/getDetailClasses');
      // load detailActions
      await this.$store.dispatch('a/base/getDetailActions');
      // fetchActions
      await this.actions_fetchActions();
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
  },
};
