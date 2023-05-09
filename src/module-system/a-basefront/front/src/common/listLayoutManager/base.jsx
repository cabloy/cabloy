export default {
  data() {
    return {
      base: {
        configAtomBase: null,
        configAtomCms: null,
        configAtom: null,
        //
        atomClass: null,
        atomClassBase: null,
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
    async base_loadAtomClass() {
      try {
        const atomClass = this.container.atomClass;
        this.base.atomClass = atomClass;
        this.base.atomClassBase = atomClass ? this.getAtomClass(atomClass) : null;
        await this.base_loadAtomMain();
        return true;
      } catch (err) {
        return false;
      }
    },
    async base_loadAtomMain() {
      if (!this.base.atomClassBase) return;
      if (!this.base.atomClassBase.detail) return;
      if (this.container.options.atomMain) return;
      this.container.options.atomMain = await this.$api.post('/a/base/atom/read', {
        key: { atomId: this.container.options.atomIdMain },
        atomClass: this.base.atomClassBase.detail.atomClassMain,
        options: {},
      });
    },
    async base_adjustContainerCategory() {
      const categoryName = this.container.options && this.container.options.category;
      if (!categoryName || typeof categoryName !== 'string') return;
      const language = this.container.options.language;
      const category = await this.$api.post('/a/base/category/parseCategoryName', {
        atomClass: this.container.atomClass,
        language,
        categoryName,
      });
      if (!category) {
        throw new Error(`Category not found: ${categoryName}`);
      }
      this.container.options.category = category.id;
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
      // for detail
      options.containerMode = this.container.mode;
      // atomIdMain
      options.atomIdMain = this.container.options.atomIdMain;
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
        const selectedAtomIds = this.container.params?.selectedAtomIds;
        options.where['a.id'] = selectedAtomIds && selectedAtomIds.length > 0 ? selectedAtomIds : null;
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
