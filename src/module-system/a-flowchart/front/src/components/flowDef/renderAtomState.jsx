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
      this.atomStage = atomClassAndStage.atomStage;
    },
    async getAtomClassAndStage() {
      const useStoreUserTask = await this.$store.use('a/flowchart/userTask');
      return await useStoreUserTask.getAtomClassAndStage({ ctx: this, context: this.context });
    },
    getDictKey() {
      if (!this.atomClass) return null;
      const atomClassBase = this.getAtomClass(this.atomClass);
      if (!atomClassBase) return null;
      const atomStage = this.atomStage;
      if (!atomStage) return null;
      const dictKey = this.$meta.util.getProperty(atomClassBase, `dict.states.${atomStage}.dictKey`);
      return dictKey;
    },
  },
  render() {
    const { parcel, key, property } = this.context;
    const dictKey = this.getDictKey();
    if (!dictKey) {
      return null;
      // return <f7-list-item>{this.context.renderTitle({ slot: 'title' })}</f7-list-item>;
    }
    const propertyNew = this.$meta.util.extend({}, property, {
      ebType: 'dict',
      ebOptionsBlankAuto: true,
      ebParams: {
        dictKey,
        mode: 'select',
        forceLoad: true,
      },
      ebRender: null,
    });
    return <eb-list-item-validate parcel={parcel} dataKey={key} property={propertyNew}></eb-list-item-validate>;
  },
};
