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
  },
  created() {
  },
  methods: {
    onChooseAssignees() {
      const { validate } = this.context;
      const url = '/a/flowchart/flowDef/assigneesEdit';
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            context: this.context,
            readOnly: validate.readOnly,
            value: this.context.getValue(),
          },
          callback: (code, data) => {
            if (code === 200) {
              this.context.setValue(data);
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
        link="#" dataPath={dataPath} title={title} propsOnChoose={this.onChooseAssignees}>
      </eb-list-item-choose>
    );
  },
};
