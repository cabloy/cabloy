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
    async onChooseSchemaFields() {
      // validate
      const { validate } = this.context;
      // atomClass
      const useStoreUserTask = await this.$store.use('a/flowchart/userTask');
      const atomClass = await useStoreUserTask.getAtomClass({ ctx: this, context: this.context });
      // queries
      const queries = {
        mode: validate.readOnly ? 'view' : 'edit',
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
      };
      // url
      const url = this.$meta.util.combineQueries('/a/baseadmin/fields/fieldsRight', queries);
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            fieldsRight: this.context.getValue(),
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
