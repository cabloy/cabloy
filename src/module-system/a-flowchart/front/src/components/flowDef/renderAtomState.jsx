import Vue from 'vue';
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
export default {
  mixins: [ebAtomClasses],
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      atomClass: null,
      atomStage: null,
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    async init() {
      const atomClassAndStage = await this.getAtomClassAndStage();
      if (!atomClassAndStage) return;
      this.atomClass = atomClassAndStage.atomClass;
      this.atomStage = parseInt(atomClassAndStage.atomStage || 0);
    },
    async getAtomClassAndStage() {
      const action = {
        name: 'getAtomClassAndStage',
        actionModule: 'a-flowchart',
        actionComponent: 'actionUserTask',
      };
      return await this.$meta.util.performAction({ ctx: this, action, item: this.context });
    },
    getDictKey() {
      if (!this.atomClass) return null;
      const atomClassBase = this.getAtomClass(this.atomClass);
      if (!atomClassBase) return null;
      const atomStage = this.atomStage === 1 ? 'formal' : 'draft';
      const dictKey = this.$meta.util.getProperty(atomClassBase, `dict.states.${atomStage}.dictKey`);
      return dictKey;
    },
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
      ebOptionsBlankAuto: true,
      ebParams: {
        dictKey,
        mode: 'select',
      },
      ebRender: null,
    });
    return <eb-list-item-validate parcel={parcel} dataKey={key} property={propertyNew}></eb-list-item-validate>;
  },
};
