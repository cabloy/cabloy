export default {
  data() {
    return {
      base: {
        ready: false,
        configMessageBase: null,
        config: null,
        layoutConfig: null,
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
      this.base.layoutConfig = await this.$store.dispatch('a/base/getLayoutConfig', 'a-basefront');
    },
    base_getLayoutConfigKeyCurrent() {
      const atomClassKey = null;
      return `message.${atomClassKey}.render.group.layout.current.${this.$view.size}`;
    },
    base_prepareSelectOptions() {
      // options
      let options = {
        where: {},
      };
      // layout
      options.layout = this.layout.current;
      // order
      // options.orders = [
      // [ 'a.updatedAt', 'desc' ],
      // ];
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
