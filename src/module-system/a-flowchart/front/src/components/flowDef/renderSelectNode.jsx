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
    ebOptions() {
      const { validate } = this.context;
      // container
      const container = validate.host.container;
      // diagram
      const diagram = container.diagram;
      // filter
      const nodes = diagram.contentProcess.nodes.map(item => {
        return {
          title: item.nameLocale || item.name,
          value: item.id,
        };
      });
      // ok
      return nodes;
    },
  },
  created() {},
  methods: {},
  render() {
    const { parcel, key, property } = this.context;
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'select',
      ebOptions: this.ebOptions,
    });
    return <eb-list-item-validate parcel={parcel} dataKey={key} property={propertyNew}></eb-list-item-validate>;
  },
};
