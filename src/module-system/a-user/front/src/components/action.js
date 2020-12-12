export default {
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'appearanceView') {
        const url = this.$meta.vueApp.layout === 'pc' ? '/a/user/view/pc' : '/a/user/view/mobile';
        ctx.$view.navigate(url, action.navigateOptions);
      }
    },
  },
};
