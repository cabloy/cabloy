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
    const mode = validate.host?.mode;
    if (mode === 'edit') {
      this.$meta.eventHub.$on('atom:listChanged', this.onActionChanged);
    }
  },
  beforeDestroy() {
    const { validate } = this.context;
    const mode = validate.host?.mode;
    if (mode === 'edit') {
      this.$meta.eventHub.$off('atom:listChanged', this.onActionChanged);
    }
  },
  methods: {
    // summary: count/sum/min/max
    _doSummary({ scope, property }) {
      const items = scope.items;
      const summaryType = property.ebParams?.summary?.type;
      const summaryField = property.ebParams?.summary?.field;
      if (summaryType === 'count') {
        return items.length;
      } else if (summaryType === 'sum') {
        return items.reduce(function (a, b) {
          return a + b[summaryField];
        }, 0);
      }
    },
    onActionChanged(data) {
      // event info
      const { atomClass: atomClassDetail, action, items } = data;
      const atomIdMain = action?.dataOptions?.atomIdMain;
      // this info
      const { parcel, property, validate } = this.context;
      if (
        atomIdMain !== parcel.data.atomId ||
        atomClassDetail.module !== property.ebParams.detailClass.module ||
        atomClassDetail.atomClassName !== property.ebParams.detailClass.atomClassName
      ) {
        return;
      }
      // evaluate
      const scope = { items };
      this.onActionChanged_evaluate({ scope, property, validate });
    },
    async onActionChanged_evaluate({ scope, property, validate }) {
      const value = this._doSummary({ scope, property });
      this.context.setValue(value);
      // submit
      if (property.ebAutoSubmit) {
        this.$nextTick(() => {
          validate.onSubmit();
        });
      }
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
