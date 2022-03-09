export default {
  data() {
    return {
      base: {
        ready: false,
        configResourceBase: null,
        config: null,
        treeData: null,
        resourcesArrayAll: null,
        layoutConfig: null,
      },
    };
  },
  computed: {
    base_ready() {
      return this.base.ready && this.actionsAll;
    },
  },
  created() {},
  methods: {
    async base_init() {
      // layoutConfig
      this.base.layoutConfig = await this.$store.dispatch('a/base/getLayoutConfig', 'a-basefront');
    },
    base_getLayoutConfigKeyCurrent() {
      return `resource.${this.container.resourceType}.render.tree.layout.current.${this.$view.size}`;
    },
    async base_load() {
      // resource
      await this.$store.dispatch('a/base/getResourceTypes');
      this.base.resourcesArrayAll = await this.$store.dispatch('a/base/getResourcesArray', {
        resourceType: this.container.resourceType,
      });
      this.base.treeData = await this.$store.dispatch('a/base/getResourceTree', {
        resourceType: this.container.resourceType,
      });
      return true;
    },
    base_onPerformResource(event, resource) {
      const resourceConfig = JSON.parse(resource.resourceConfig);
      // special for action
      let action;
      let item;
      if (resourceConfig.atomAction === 'create') {
        //
        action = this.getAction({
          module: resourceConfig.module,
          atomClassName: resourceConfig.atomClassName,
          name: resourceConfig.atomAction,
        });
        item = {
          module: resourceConfig.module,
          atomClassName: resourceConfig.atomClassName,
        };
      } else if (resourceConfig.atomAction === 'read') {
        if (!resourceConfig.actionComponent && !resourceConfig.actionPath) {
          resourceConfig.actionPath = '/a/basefront/atom/list?module={{module}}&atomClassName={{atomClassName}}';
        }
        action = resourceConfig;
        item = {
          module: resourceConfig.module,
          atomClassName: resourceConfig.atomClassName,
        };
      } else {
        action = resourceConfig;
      }
      action = this.$utils.extend({}, action, { targetEl: event.currentTarget });
      return this.$meta.util.performAction({ ctx: this, action, item });
    },
  },
};
