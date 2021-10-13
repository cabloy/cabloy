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
      // nodeId
      const nodeId = container.id;
      // filter
      const nodes = diagram.contentProcess.nodes
        .filter(item => {
          return (
            item.id !== nodeId &&
            (item.type.indexOf('startEventAtom') > -1 || item.type.indexOf('activityUserTask') > -1)
          );
        })
        .map(item => {
          return {
            title: item.nameLocale || item.name,
            value: item.id,
          };
        });
      // default
      nodes.unshift({ title: 'Default', value: '' });
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
