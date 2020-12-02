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
      return {
        module: this.context.data.module,
        atomClassName: this.context.data.atomClassName,
      };
    },
    locales() {
      return this.$store.getState('a/base/locales');
    },
  },
  created() {
    this.$store.dispatch('a/base/getLocales').then(locales => {
      if (locales.length === 1) {
        this.context.data.atomLanguage = locales[0].value;
      }
    });
  },
  methods: {
  },
  render() {
    const { data, pathParent, key, schema, properties, property, meta } = this.context;
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'select',
      ebOptions: this.locales,
    });
    return (
      <eb-list-item-validate
        data={data} pathParent={pathParent} schema={schema} properties={properties} meta={meta}
        dataKey={key} property={propertyNew}>
      </eb-list-item-validate>
    );
  },
};
