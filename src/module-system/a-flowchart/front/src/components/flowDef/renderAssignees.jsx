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
    onChooseAssignees() {
      const { validate } = this.context;
      // container
      const container = validate.host.container;
      // queries
      const queries = {
        flowDefId: container.flowDefId,
        nodeId: container.id,
      };
      // url
      const url = this.$meta.util.combineQueries('/a/flowchart/flowDef/assigneesEdit', queries);
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
    return (
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseAssignees}>
        {this.context.renderTitle({ slot: 'title' })}
      </eb-list-item-choose>
    );
  },
};
