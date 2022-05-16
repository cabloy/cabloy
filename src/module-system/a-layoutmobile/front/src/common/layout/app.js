export default {
  data() {
    return {
      app: {
        keyDefault: 'a-app:appDefault',
      },
    };
  },
  methods: {
    async app_openHome({ view, appKey, appLanguage }) {
      // set current
      this.$meta.store.commit('a/app/setCurrent', { appKey, appLanguage });
      // get current
      const current = this.$store.getters['a/app/current'];
      // open menu
      await this.app_openAppMenu({ view, current });
    },
    async app_openAppMenu({ view, current }) {
      // url
      const url = `/a/app/appMenu?appKey=${current.appKey}`;
      // navigate
      view.navigate(url, {
        target: '_self',
      });
    },
  },
};
