export default {
  methods: {
    async app_openHome() {
      await this.app_openAppMenu();
      await this.app_openAppHome();
      // await this.app_openAppUser();
    },
    async app_openAppMenu() {
      // current
      const current = this.$store.getters['a/app/current'];
      const appItemCurrent = this.$store.getters['a/app/appItemCurrent'];
      // app default
      if (current.appKey !== 'a-app:appDefault' && !appItemCurrent.isolate) {
        const appItemDefault = await this.$store.dispatch('a/app/getAppItem', { appKey: 'a-app:appDefault' });
        this.navigate('/a/app/appMenu', {
          scene: 'sidebar',
          sceneOptions: { side: 'left', name: 'a-app:appDefault', title: appItemDefault.atomNameLocale },
        });
      }
    },
    async app_openAppHome() {},
  },
};
