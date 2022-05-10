export default {
  data() {
    return {
      base: {
        configAppMenuBase: null,
        configAppMenu: null,
        //
        appPresetConfig: null,
      },
    };
  },
  methods: {
    async base_onInit() {
      // load appItem
      this.base.appPresetConfig = await this.$store.dispatch('a/app/getPresetConfig', {
        appKey: this.container.appKey,
      });
    },
  },
};
