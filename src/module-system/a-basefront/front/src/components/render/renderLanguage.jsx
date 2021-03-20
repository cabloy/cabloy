export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
    };
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
      return this.$store.getState('a/base/locales');
    },
  },
  created() {
    this.$store.dispatch('a/base/getLocales').then(locales => {
      if (locales.length === 1) {
        this.context.setValue(locales[0].value, 'atomLanguage');
      }
    });
  },
  methods: {
  },
  render() {
    const { parcel, key, property, meta } = this.context;
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'select',
      ebOptions: this.locales,
    });
    return (
      <eb-list-item-validate
        parcel={parcel} meta={meta}
        dataKey={key} property={propertyNew}>
      </eb-list-item-validate>
    );
  },
};
