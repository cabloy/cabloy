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
    async getSchemaReference() {
      const useStoreUserTask = await this.$store.use('a/flowchart/userTask');
      return await useStoreUserTask.getSchemaReference({ ctx: this, context: this.context });
    },
    async onChooseSchemaFields() {
      const schemaReference = await this.getSchemaReference();
      if (!schemaReference) return;
      // module
      await this.$meta.module.use(schemaReference.module);
      // validate
      const { validate } = this.context;
      // container
      const container = validate.host.container;
      // queries
      const queries = {
        flowDefId: container.flowDefId,
        nodeId: container.id,
      };
      // url
      const url = this.$meta.util.combineQueries('/a/baseadmin/fields/fieldsRight', queries);
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            context: this.context,
            readOnly: validate.readOnly,
            value: this.context.getValue(),
            schemaReference,
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
      <eb-list-item-choose link="#" dataPath={dataPath} propsOnChoose={this.onChooseSchemaFields}>
        {this.context.renderTitle({ slot: 'title' })}
      </eb-list-item-choose>
    );
  },
};
