export default {
  methods: {
    async app_openHome() {
      await this.app_openAppMenu();
      await this.app_openAppHome();
      // await this.app_openAppUser();
    },
    async app_openAppMenu() {
      // app default
      this.navigate('/a/app/appMenu', {
        scene: 'sidebar',
        sceneOptions: { side: 'left', name: 'properties', title: 'Properties' },
      });
    },
    async app_openAppHome() {},
  },
};
