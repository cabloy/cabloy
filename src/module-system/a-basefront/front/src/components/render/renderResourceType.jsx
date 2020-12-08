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
    resourceTypes() {
      const resourceTypes = this.$store.getState('a/base/resourceTypes');
      if (!resourceTypes) return [];
      return Object.keys(resourceTypes).map(key => {
        return {
          title: resourceTypes[key].titleLocale,
          value: key,
        };
      });
    },
  },
  created() {
    this.$store.dispatch('a/base/getResourceTypes');
  },
  methods: {
  },
  render() {
    const { data, pathParent, key, schema, properties, property, meta } = this.context;
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'select',
      ebOptions: this.resourceTypes,
    });
    return (
      <eb-list-item-validate
        data={data} pathParent={pathParent} schema={schema} properties={properties} meta={meta}
        dataKey={key} property={propertyNew}>
      </eb-list-item-validate>
    );
  },
};
