export default {
  data() {
    return {
      component_instances_values: {},
    };
  },
  beforeDestroy() {
    this.component_instances_values = {};
  },
  methods: {
    __componentInstance_get(parcel, name) {
      // dataPath
      const dataPath = parcel.pathParent + name;
      return this.component_instances_values[dataPath];
    },
    __componentInstance_set(parcel, name, componentInstance) {
      // dataPath
      const dataPath = parcel.pathParent + name;
      this.component_instances_values[dataPath] = componentInstance;
    },
  },
};
