export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  mounted() {
    const { validate } = this.context;
    const mode = validate.host && validate.host.mode;
    if (mode === 'edit') {
      this.$meta.eventHub.$on('details:change', this.onActionChanged);
    }
  },
  beforeDestroy() {
    const { validate } = this.context;
    const mode = validate.host && validate.host.mode;
    if (mode === 'edit') {
      this.$meta.eventHub.$off('details:change', this.onActionChanged);
    }
  },
  methods: {
    onActionChanged(data) {
      const { atomKey, detailClass, details } = data;
      const { parcel, property, validate } = this.context;
      if (
        atomKey.atomId !== parcel.data.atomId ||
        detailClass.module !== property.ebParams.detailClass.module ||
        detailClass.detailClassName !== property.ebParams.detailClass.detailClassName
      ) {
        return;
      }

      // evaluate
      const scope = { details };
      this.$meta.util.sandbox
        .evaluate(property.ebParams.expression, scope)
        .then(value => {
          this.context.setValue(value);
          // submit
          if (property.ebAutoSubmit) {
            this.$nextTick(() => {
              validate.onSubmit();
            });
          }
        })
        .catch(err => {
          throw err;
        });
    },
  },
  render() {
    const { parcel, key, property } = this.context;
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'text',
    });
    return <eb-list-item-validate parcel={parcel} dataKey={key} property={propertyNew}></eb-list-item-validate>;
  },
};
