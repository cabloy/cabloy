export default {
  data() {
    return {
      antdv: {
        locales: null,
      },
    };
  },
  created() {
    // locales
    const action = {
      actionModule: 'a-antdv',
      actionComponent: 'antdv',
      name: 'locales',
    };
    this.$meta.util.performAction({ ctx: this, action }).then(locales => {
      this.antdv.locales = locales;
    });
  },
  methods: {
    antdv_getLocale() {
      if (!this.antdv.locales) return null;
      const locale = this.$meta.util.getLocale();
      if (!locale || locale === 'en-us') return null;
      return this.antdv.locales[locale];
    },
  },
};
