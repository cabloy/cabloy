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
      // flowServiceBases
      this.flowServiceBases = await this.$local.dispatch('getFlowServiceBases');
    },
  },
  render() {
    const { parcel, key, property } = this.context;
    const meta = {
      ebPatch: {
        getValue: value => {
          return value ? `${value.module}:${value.name}` : '';
        },
        setValue: value => {
          if (!value) return null;
          const arr = value.split(':');
          if (!arr[0] || !arr[1]) return null;
          // ok
          return {
            module: arr[0],
            name: arr[1],
          };
        },
      },
    };
    const propertyNew = this.$utils.extend({}, property, {
      ebType: 'select',
      ebOptions: this.ebOptions,
    });
    return (
      <eb-list-item-validate
        parcel={parcel}
        dataKey={key} property={propertyNew} meta={meta}>
      </eb-list-item-validate>
    );
  },
};
