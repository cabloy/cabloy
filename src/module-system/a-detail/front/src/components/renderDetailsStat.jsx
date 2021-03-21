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
  created() {},
  methods: {},
  render() {
    const { parcel, key, property, meta } = this.context;
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'text',
    });
    return (
      <eb-list-item-validate
        parcel={parcel} meta={meta}
        dataKey={key} property={propertyNew}>
      </eb-list-item-validate>
    );
  },
};
