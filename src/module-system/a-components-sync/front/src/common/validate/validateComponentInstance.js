export default {
  data() {
    return {
      __componentInstances: {},
    };
  },
  beforeDestroy() {
    this.__componentInstances = {};
  },
  methods: {
    __componentInstance_set(parcel, name, componentInstance) {
      // dataPath
      const dataPath = parcel.pathParent + name;
      this.__componentInstances[dataPath] = componentInstance;
    },
  },
};
