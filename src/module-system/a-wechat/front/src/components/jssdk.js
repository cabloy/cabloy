export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ ctx, action, item }) {
      if (action.name === 'config') {
        return new Promise((resolve, reject) => {
          const url = location.href.split('#')[0];
          this.$api.post('jssdk/jsconfig', { url }).then(res => {
            resolve(res);
          });
        });
      }
    },
  },
};
