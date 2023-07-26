export default {
  data() {
    return {
      antdv: {
        locales: null,
      },
    };
  },
  created() {
    this.antdv_init();
  },
  methods: {
    async antdv_init() {
      // locales
      const useStoreAntdv = await this.$store.use('a/antdv/antdv');
      const locales = await useStoreAntdv.getLocales();
      this.antdv.locales = locales;
    },
    antdv_getLocale() {
      if (!this.antdv.locales) return null;
      const locale = this.$meta.util.getLocale();
      if (!locale || locale === 'en-us') return null;
      return this.antdv.locales[locale];
    },
  },
};
