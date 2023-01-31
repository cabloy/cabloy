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
  created() {
    this.init();
  },
  methods: {
    async init() {
      const atomClassAndStage = await this.getAtomClassAndStage();
      console.log(atomClassAndStage);
    },
    async getAtomClassAndStage() {
      const action = {
        name: 'getAtomClassAndStage',
        actionModule: 'a-flowchart',
        actionComponent: 'actionUserTask',
      };
      return await this.$meta.util.performAction({ ctx: this, action, item: this.context });
    },
  },
  render() {
    const { dataPath } = this.context;
    const title = this.context.getTitle();
    return <div></div>;
  },
};
