export default {
  data() {
    return {
      base: {
        configAppMenuBase: null,
        configAppMenu: null,
        //
        appItem: null,
        appPresetConfig: null,
      },
    };
  },
  computed: {
    base_atomClassApp() {
      return {
        module: 'a-app',
        atomClassName: 'app',
      };
    },
  },
  methods: {
    async base_onInit() {
      // load appItem
      this.base.appItem = await this.$store.dispatch('a/app/getAppItem', {
        appKey: this.container.appKey,
      });
      this.base.appPresetConfig = await this.$store.dispatch('a/app/getPresetConfig', {
        appKey: this.container.appKey,
      });
    },
    base_prepareSelectOptions() {
      // options
      let options = {
        where: {},
      };
      // layout
      options.layout = this.layout.current;
      // order
      options.orders = [['a.createdAt', 'desc']];
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
        messageClass: this.base_messageClass,
        options,
      };
      return params;
    },
  },
};
