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
    save() {
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
            ctx: this,
            item: parcel.data,
            readOnly: validate.readOnly,
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
    const title = this.context.getTitle();
    return <eb-list-item-choose link="#" dataPath={dataPath} title={title} propsOnChoose={this.onChooseEditContent}></eb-list-item-choose>;
  },
};
