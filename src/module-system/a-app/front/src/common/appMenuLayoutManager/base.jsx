export default {
  data() {
    return {
      base: {
        configAppMenuBase: null,
        configAppMenu: null,
        //
        appItem: null,
        appPresetConfig: null,
        //
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
    base_appCurrent() {
      return this.$store.getters['a/app/current'];
    },
    base_appLanguageCurrent() {
      return this.base_appCurrent.appLanguage;
    },
  },
  watch: {
    base_appCurrent(current) {
      if (!this.base.appMineInited) return;
      if (!current.appKey) return;
      if (!this.$meta.vueLayout.started) return;
      this.base_app_switch({ appKey: current.appKey });
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
    base_onPerformResource(event, resource) {
      const resourceConfig = JSON.parse(resource.resourceConfig);
      // special for action
      let action;
      let item;
      if (resourceConfig.atomAction === 'create') {
        //
        action = this.getAction({
          module: resourceConfig.module,
          atomClassName: resourceConfig.atomClassName,
          name: resourceConfig.atomAction,
        });
        item = {
          module: resourceConfig.module,
          atomClassName: resourceConfig.atomClassName,
        };
      } else if (resourceConfig.atomAction === 'read') {
        if (!resourceConfig.actionComponent && !resourceConfig.actionPath) {
          resourceConfig.actionPath = '/a/basefront/atom/list?module={{module}}&atomClassName={{atomClassName}}';
        }
        action = resourceConfig;
        item = {
          module: resourceConfig.module,
          atomClassName: resourceConfig.atomClassName,
        };
      } else {
        action = resourceConfig;
      }
      action = this.$utils.extend({}, action, { targetEl: event.currentTarget });
      return this.$meta.util.performAction({ ctx: this, action, item });
    },
    base_isChildMode() {
      const __appKeyDefault = this.$config.appKey.default;
      if (this.container.appKey === __appKeyDefault) return false;
      if (!this.base.appItem) return false;
      if (this.base.appItem.isolate) return false;
      return true;
    },
  },
};
