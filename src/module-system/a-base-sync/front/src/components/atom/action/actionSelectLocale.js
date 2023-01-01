export default {
  methods: {
    async _onActionSelectLocale() {
      const { ctx, action, item } = this.$props;
      if (item && item.module && item.atomClassName) {
        const atomClasses = await ctx.$store.dispatch('a/base/getAtomClasses');
        const atomClass = atomClasses[item.module][item.atomClassName];
        // not support language
        if (!atomClass.language) {
          return null;
        }
      }
      // only one
      const locales = await ctx.$store.dispatch('a/base/getLocales');
      if (locales.length === 1) {
        return locales[0];
      }
      // current
      const current = (item && item.current) || {};
      // icon
      const iconDone = await this.$meta.util.combineIcon({ f7: '::done' });
      // buttons
      const buttons = [
        {
          text: ctx.$text('SelectLanguageTip'),
          label: true,
        },
      ];
      for (const locale of locales) {
        const icon = locale.value === current.value ? iconDone : '<i class="icon"></i>';
        buttons.push({
          icon,
          text: locale.title,
          data: locale,
        });
      }
      // choose
      const params = {
        targetEl: action.targetEl,
        buttons,
      };
      let view = ctx.$view;
      if (!view) {
        view = this.$meta.vueLayout.appMethods;
        params.forceToPopover = true;
      }
      const button = await view.actions.choose(params);
      return button.data;
    },
  },
};
