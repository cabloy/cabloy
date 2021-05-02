export default {
  data() {
    return {
      base: {
        ready: false,
        configResourceBase: null,
        config: null,
        treeData: null,
        resourcesArrayAll: null,
      },
    };
  },
  computed: {
    base_ready() {
      return this.base.ready && this.actionsAll;
    },
  },
  created() {
  },
  methods: {
    async base_load() {
      this.$store.dispatch('a/base/getResourceTypes');
      this.base.resourcesArrayAll = await this.$store.dispatch('a/base/getResourcesArray', { resourceType: this.container.resourceType });
      this.base.treeData = await this.$store.dispatch('a/base/getResourceTrees', { resourceType: this.container.resourceType });
      return true;
    },
  },
};
