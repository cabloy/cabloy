export default {
  data() {
    return {
      app: {
        keyDefault: 'a-app:appDefault',
      },
    };
  },
  methods: {
    async app_openAppMenu({ view }) {
      // get current
      const current = this.$store.getters['a/app/current'];
      // url
      const url = `/a/app/appMenu?appKey=${current.appKey}`;
      // navigate
      view.navigate(url, {
        target: '_self',
      });
    },
  },
};
