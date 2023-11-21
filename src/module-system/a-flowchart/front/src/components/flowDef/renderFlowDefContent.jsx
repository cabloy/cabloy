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
    async onSave() {
      const { validate } = this.context;
      return await validate.perform(null, { action: 'save' });
    },
    async onChooseEditContent() {
      const { parcel, validate } = this.context;
      // item
      let item;
      // save when createDelay
      if (validate.host.container.params?.createDelay) {
        item = await this.onSave();
      } else {
        item = parcel.data;
      }
      // navigate
      const url = '/a/flowchart/flowDef/contentEdit';
      this.$view.navigate(url, {
        target: validate.readOnly ? '_self' : undefined,
        context: {
          params: {
            item,
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
