export default {
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'appearanceView') {
        const url = ctx.$meta.vueApp.layout === 'pc' ? '/a/user/view/pc' : '/a/user/view/mobile';
        ctx.$view.navigate(url, action.navigateOptions);
      } else if (action.name === 'appearanceLanguage') {
        const _action = {
          actionModule: 'a-base',
          actionComponent: 'action',
          name: 'selectLocale',
          targetEl: action.targetEl,
        };
        const locale = await ctx.$meta.util.performAction({ ctx, action: _action, item: null });
        if (locale && locale.value !== ctx.$store.state.auth.user.agent.locale) {
          // save
          await ctx.$api.post('/a/user/user/saveLocale', {
            data: { locale: locale.value },
          });
          // confirm
          await ctx.$view.dialog.confirm(ctx.$text('LocaleReloadConfirmText'));
          // this.$meta.vueApp.reload({ echo: false });
          window.location.reload();
        }
      }
    },
  },
};
