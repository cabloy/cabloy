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
      // buttons
      const buttons = [
        {
          text: ctx.$text('SelectLanguageTip'),
          label: true,
        },
      ];
      for (const locale of locales) {
        buttons.push({
          text: locale.title,
          data: locale,
        });
      }
      // choose
      const params = {
        targetEl: action.targetEl,
        buttons,
      };
      const button = await ctx.$view.actions.choose(params);
      return button.data;
    },
  },
};
