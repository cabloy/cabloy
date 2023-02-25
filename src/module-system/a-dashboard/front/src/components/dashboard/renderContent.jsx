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
  methods: {
    onSave() {
      const { validate } = this.context;
      return validate.perform(null, { action: 'save' });
    },
    onChooseEditContent() {
      const { parcel, validate } = this.context;
      const url = `/a/dashboard/dashboard?scene=manager&atomId=${parcel.data.atomId}`;
      this.$view.navigate(url, {
        target: '_view',
        context: {
          params: {
            ctx: this,
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
