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
      dict: null,
    };
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    async init() {
      // atomClass / atomStage
      const atomClassAndStage = await this.getAtomClassAndStage();
      if (!atomClassAndStage) return;
      this.atomClass = atomClassAndStage.atomClass;
      this.atomStage = atomClassAndStage.atomStage;
      // dict
      const useStoreAtomState = await this.$store.use('a/basestore/atomState');
      this.dict = await useStoreAtomState.getDict({ atomClass: this.atomClass, atomStage: this.atomStage });
    },
    async getAtomClassAndStage() {
      const useStoreUserTask = await this.$store.use('a/flowchart/userTask');
      return await useStoreUserTask.getAtomClassAndStage({ ctx: this, context: this.context });
    },
  },
  render() {
    const { parcel, key, property } = this.context;
    if (!this.dict) {
      return null;
      // return <f7-list-item>{this.context.renderTitle({ slot: 'title' })}</f7-list-item>;
    }
    const propertyNew = this.$meta.util.extend({}, property, {
      ebType: 'dict',
      ebOptionsBlankAuto: true,
      ebParams: {
        dict: this.dict,
        forceLoad: true,
      },
      ebRender: null,
    });
    return <eb-list-item-validate parcel={parcel} dataKey={key} property={propertyNew}></eb-list-item-validate>;
  },
};
