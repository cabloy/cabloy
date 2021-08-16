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
      // choose
      return new Promise((resolve, reject) => {
        const hostEl = ctx.$view.getHostEl();
        const targetEl = action.targetEl;
        const buttons = [
          {
            text: ctx.$text('SelectLanguageTip'),
            label: true,
          },
        ];
        let resolved = false;
        function onButtonClick(locale) {
          resolved = true;
          resolve(locale);
        }
        for (const locale of locales) {
          buttons.push({
            text: locale.title,
            onClick: () => {
              onButtonClick(locale);
            },
          });
        }
        const actions = ctx.$f7.actions.create({ hostEl, buttons, targetEl });
        function onActionsClosed() {
          actions.destroy();
          if (!resolved) {
            resolved = true;
            reject(new Error());
          }
        }
        actions.open().once('actionsClosed', onActionsClosed).once('popoverClosed', onActionsClosed);
      });
    },
  },
};
