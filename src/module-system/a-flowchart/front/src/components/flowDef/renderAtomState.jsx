export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      atomClassAndStage: null,
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.atomClassAndStage = await this.getAtomClassAndStage();
    },
    async getAtomClassAndStage() {
      const action = {
        name: 'getAtomClassAndStage',
        actionModule: 'a-flowchart',
        actionComponent: 'actionUserTask',
      };
      return await this.$meta.util.performAction({ ctx: this, action, item: this.context });
    },
    getDictKey() {},
  },
  render() {
    const { parcel, key, property } = this.context;
    const title = this.context.getTitle();
    const dictKey = this.getDictKey();
    if (!dictKey) {
      return <f7-list-item title={title}></f7-list-item>;
    }
    const propertyNew = this.$meta.util.extend({}, property, {
      ebType: 'dict',
      ebParams: {
        dictKey,
        mode: 'select',
      },
      ebRender: null,
    });
    return <eb-list-item-validate parcel={parcel} dataKey={key} property={propertyNew}></eb-list-item-validate>;
  },
};
