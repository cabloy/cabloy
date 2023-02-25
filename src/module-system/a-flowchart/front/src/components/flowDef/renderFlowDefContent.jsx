export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
    onSave() {
      const { validate } = this.context;
      return validate.perform(null, { action: 'save' });
    },
    onChooseEditContent() {
      const { parcel, validate } = this.context;
      const url = '/a/flowchart/flowDef/contentEdit';
      this.$view.navigate(url, {
        target: validate.readOnly ? '_self' : undefined,
        context: {
          params: {
            item: parcel.data,
            readOnly: validate.readOnly,
            onSave: () => {
              return this.onSave();
            },
          },
          callback: (code, res) => {
            if (code === 200) {
              this.context.setValue(res.content);
            }
          },
        },
      });
    },
  },
  render() {
    const { dataPath } = this.context;
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseEditContent}>
        {this.context.renderTitle({ slot: 'title' })}
      </eb-list-item-choose>
    );
  },
};
