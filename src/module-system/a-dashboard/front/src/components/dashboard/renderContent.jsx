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
  created() {
  },
  methods: {
    save() {
      const { validate } = this.context;
      return validate.perform(null, { action: 'save' });
    },
    onChooseEditContent() {
      const { data, validate } = this.context;
      const url = `/a/dashboard/dashboard?scene=manager&atomId=${data.atomId}`;
      this.$view.navigate(url, {
        target: '_view',
        context: {
          params: {
            ctx: this,
            item: data,
            readOnly: validate.readOnly,
          },
          callback: (code, res) => {
            if (code === 200) {
              data.content = res.content;
            }
          },
        },
      });
    },
  },
  render() {
    const { dataPath } = this.context;
    const title = this.context.getTitle();
    return (
      <eb-list-item-choose
        link="#" dataPath={dataPath} title={title} propsOnChoose={this.onChooseEditContent}>
      </eb-list-item-choose>
    );
  },
};
