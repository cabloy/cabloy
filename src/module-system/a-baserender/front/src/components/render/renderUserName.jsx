export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
  render() {
    const { dataPath, property, validate } = this.context;
    const title = this.context.getTitle();
    const value = this.context.getValue();
    if (validate.readOnly || property.ebReadOnly) {
      return (
        <f7-list-item title={title}>
          <div slot="after">{value}</div>
        </f7-list-item>
      );
    }
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} title={title} propsOnChoose={this.onChooseUser}>
        <div slot="after">{value}</div>
      </eb-list-item-choose>
    );
  },
};
