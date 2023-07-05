export default {
  methods: {
    async onAction({ ctx, action /* , item*/ }) {
      const actionName = action.actionName || action.name;
      if (actionName === 'appearanceView') {
        const url = ctx.$meta.vueApp.layout === 'pc' ? '/a/user/view/pc' : '/a/user/view/mobile';
        ctx.$view.navigate(url, action.navigateOptions);
      } else if (actionName === 'appearanceLanguage') {
        const _action = {
          actionModule: 'a-base',
          actionComponent: 'action',
          name: 'selectLocale',
          targetEl: action.targetEl,
        };
        const localeCurrent = {
          value: ctx.$meta.util.getLocale(),
        };
        const locale = await ctx.$meta.util.performAction({ ctx, action: _action, item: { current: localeCurrent } });
        if (locale && locale.value !== ctx.$store.state.auth.user.agent.locale) {
          // save
          await ctx.$api.post('/a/user/user/saveLocale', {
            data: { locale: locale.value },
          });
          // locale
          ctx.$meta.util.setLocale(locale.value);
          // set current app language
          await this.$meta.store.dispatch('a/app/setCurrent', { appLanguage: locale.value });
          // // confirm
          // let view = ctx.$view;
          // if (!view) {
          //   view = this.$meta.vueLayout.appMethods;
          // }
          // await view.dialog.confirm(ctx.$text('LocaleReloadConfirmText'));
          // reload
          // this.$meta.vueApp.reload({ echo: false });
          window.location.reload();
        }
      }
    },
  },
};
