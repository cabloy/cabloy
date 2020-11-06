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
    languages() {
      return this.$local.state.languages[this.atomClass.module];
    },
  },
  created() {
    this.$local.dispatch('getLanguages', {
      atomClass: this.atomClass,
    }).then(res => {
      if (res.length === 1) {
        this.context.data.language = res[0].value;
      }
    });
  },
  methods: {
  },
  render() {
    const { data, pathParent, key, schema, properties, property, meta } = this.context;
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'select',
      ebOptions: this.languages,
    });
    return (
      <eb-list-item-validate
        data={data} pathParent={pathParent} schema={schema} properties={properties} meta={meta}
        dataKey={key} property={propertyNew}>
      </eb-list-item-validate>
    );
  },
};
