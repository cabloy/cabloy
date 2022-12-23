const __appKeyDefault = 'a-app:appDefault';

export default {
  data() {
    return {
      theme: {
        appKey: null,
      },
    };
  },
  methods: {
    theme_get() {
      return this.$meta.theme.get(this.theme.appKey) || this.$meta.theme.default();
    },
    async theme_set(theme) {
      const appKey = this.theme.appKey;
      // set theme
      this.$meta.theme.set(appKey, theme);
      // user.op
      if (this.user.op.anonymous) return;
      // save
      await this.$api.post('/a/user/user/themeSave', {
        appKey,
        theme,
      });
    },
    async theme_init() {
      // from app
      const { appKey, theme: themeApp } = await this.theme_init_fromApp();
      // from user
      let theme = await this.$api.post('/a/user/user/themeLoad', {
        appKey,
      });
      if (!theme) {
        // from localStoragy/egg-born-front
        theme = this.$meta.theme.get(appKey);
      }
      if (!theme) {
        theme = themeApp;
      }
      // patch
      if (theme && theme.type === 'builtIn' && !theme.builtIn) {
        theme = Object.assign({}, theme, { builtIn: this.$meta.theme.default().builtIn });
      }
      // set theme
      this.$meta.theme.set(appKey, theme);
      // hold key
      this.theme.appKey = appKey;
    },
    async theme_init_fromApp() {
      // sure appItemCurrent exists
      const appItemCurrent = await this.$store.dispatch('a/app/getAppItemCurrent');
      let theme = this.$meta.util.getProperty(appItemCurrent, 'content.info.theme');
      if (theme) {
        return {
          appKey: appItemCurrent.atomStaticKey,
          theme,
        };
      }
      // default app
      if (appItemCurrent.atomStaticKey !== __appKeyDefault) {
        const appItemDefault = await this.$store.dispatch('a/app/getAppItemDefault');
        theme = this.$meta.util.getProperty(appItemDefault, 'content.info.theme');
        if (theme) {
          return {
            appKey: __appKeyDefault,
            theme,
          };
        }
      }
      // always default app
      return {
        appKey: __appKeyDefault,
        theme: null,
      };
    },
  },
};
