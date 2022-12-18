export default {
  data() {
    return {
      base: {
        configAtomBase: null,
        configAtomCms: null,
        configAtom: null,
      },
    };
  },
  computed: {
    base_userLabels() {
      return this.$store.getters['a/base/userLabels'];
    },
  },
  created() {
    this.$store.dispatch('a/base/getLabels');
  },
  methods: {
    async base_onInit() {
      // load atomClasses
      await this.$store.dispatch('a/base/getAtomClasses');
      // adjust container category
      await this.base_adjustContainerCategory();
    },
    async base_adjustContainerCategory() {
      const category = this.container.options && this.container.options.category;
      if (!category || typeof category !== 'string') return;
    },
    base_prepareReadOptions() {
      // options
      const options = {};
      // layout
      options.layout = this.layout.current;
      // resource
      if (this.container.resource) {
        options.resource = 1;
        options.resourceLocale = this.$meta.util.getLocale();
      }
      // options
      return options;
    },
    base_prepareSelectOptions() {
      // options
      let options = {
        where: {},
      };
      // layout
      options.layout = this.layout.current;
      // resource
      if (this.container.resource) {
        options.resource = 1;
        options.resourceLocale = this.$meta.util.getLocale();
      }
      // search
      if (this.search.query) {
        options.where['a.atomName'] = { val: this.search.query, op: 'like' };
      }
      // select
      if (this.container.scene === 'select') {
        options.where['a.id'] =
          this.container.params.selectedAtomIds.length > 0 ? this.container.params.selectedAtomIds : null;
      }
      // extend 1
      if (this.container.options) {
        options = this.$utils.extend({}, options, this.container.options);
      }
      // options
      return options;
    },
    base_prepareSelectParams(opts) {
      const setOrder = !opts || opts.setOrder !== false;
      // options
      const options = this.base_prepareSelectOptions();
      // params
      let params = {
        atomClass: this.container.atomClass,
        options,
      };
      // filter
      const filterParams = this.filter_prepareSelectParams();
      if (filterParams) {
        params = this.$utils.extend({}, params, filterParams);
      }
      // order
      if (setOrder) {
        const atomOrderCurrent = this.order.selected || this.order_default(params);
        params.options.orders = [[this.order_getKey(atomOrderCurrent), atomOrderCurrent.by]];
      }
      // ok
      return params;
    },
    base_getItems() {
      return this.data_getItems();
    },
    base_getCurrentStage() {
      let stage = this.$meta.util.getProperty(this.filter.data, 'form.stage');
      if (!stage) stage = this.container.options && this.container.options.stage;
      if (!stage) stage = 'formal';
      return stage;
    },
    base_stageToString(stage) {
      return stage === 0 ? 'draft' : stage === 1 ? 'formal' : 'history';
    },
    base_getExportFields() {
      return this.$meta.util.getProperty(this.layout.configFull, 'info.export.fields');
    },
  },
};
