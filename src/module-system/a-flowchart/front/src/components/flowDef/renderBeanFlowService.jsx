import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
export default {
  mixins: [ ebModules ],
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      flowServiceBases: null,
      options: [],
    };
  },
  computed: {
    ebOptions() {
      if (!this.modulesAll || !this.flowServiceBases) return [];
      const groups = [];
      for (const moduleName in this.flowServiceBases) {
        const module = this.modulesAll[moduleName];
        const flowServiceBasesModule = this.flowServiceBases[moduleName];
        const group = {
          title: module.titleLocale,
          options: [],
        };
        groups.push(group);
        for (const beanName in flowServiceBasesModule) {
          const flowServiceBase = flowServiceBasesModule[beanName];
          const title = flowServiceBase.titleLocale;
          const value = `${moduleName}:${beanName}`;
          group.options.push({
            title,
            value,
          });
        }
      }
      return groups;
    },
  },
  created() {
    this.__init();
  },
  methods: {
    async __init() {
      this.flowServiceBases = await this.$local.dispatch('getFlowServiceBases');
    },
  },
  render() {
    const { parcel, key, property } = this.context;
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'select',
      ebOptions: this.ebOptions,
    });
    return (
      <eb-list-item-validate
        parcel={parcel}
        dataKey={key} property={propertyNew}>
      </eb-list-item-validate>
    );
  },
};
