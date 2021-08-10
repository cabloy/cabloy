export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    atomClass() {
      const { parcel } = this.context;
      return {
        module: parcel.data.module,
        atomClassName: parcel.data.atomClassName,
      };
    },
    locales() {
      const locales = this.$store.getState('a/base/locales');
      return locales || [];
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const locales = await this.$store.dispatch('a/base/getLocales');
      if (locales.length === 1) {
        const atomLanguage = this.context.getValue('atomLanguage');
        if (!atomLanguage && atomLanguage !== undefined) {
          this.context.setValue(locales[0].value, 'atomLanguage');
        }
      }
    },
  },
  render() {
    const { parcel, key, property } = this.context;
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'select',
      ebOptions: this.locales,
    });
    return <eb-list-item-validate parcel={parcel} dataKey={key} property={propertyNew}></eb-list-item-validate>;
  },
};
