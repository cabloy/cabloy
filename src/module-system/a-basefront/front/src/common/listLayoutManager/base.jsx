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
        //
        _atomMain: null,
      },
    };
  },
  computed: {
    base_userLabels() {
      return this.$store.getters['a/base/userLabels'];
    },
    base_atomIdMain() {
      return this.container.options?.atomIdMain;
    },
    base_atomMain() {
      return this.container.options?.atomMain || this.base._atomMain;
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
        if (!atomClass) {
          this.base.atomClass = null;
          this.base.atomClassBase = null;
        } else {
          this.base.atomClass = atomClass;
          const useStoreAtomClasses = await this.$store.use('a/basestore/atomClasses');
          this.base.atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass });
        }
        return true;
      } catch (err) {
        return false;
      }
    },
    async base_loadAtomMain() {
      if (!this.base.atomClassBase) return;
      if (!this.base.atomClassBase.detail) return;
      if (this.container.options?.atomMain) return;
      const atomIdMain = this.base_atomIdMain;
      this.base._atomMain = await this.$api.post('/a/base/atom/read', {
        key: { atomId: atomIdMain },
        atomClass: this.base.atomClassBase.detail.atomClassMain,
        options: {},
      });
    },
    async base_adjustContainerCategory() {
      const categoryName = this.container.options?.category;
      if (!categoryName || typeof categoryName !== 'string') return;
      const language = this.container.options?.language;
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
      let options = {};
      // extend 1
      if (this.container.options) {
        const containerOptions = Object.assign({}, this.container.options);
        delete containerOptions.atomMain;
        options = this.$utils.extend({}, options, containerOptions);
      }
      // layout
      options.layout = this.layout.current;
      // resource
      if (this.container.resource) {
        options.resource = 1;
        options.resourceLocale = this.$meta.util.getLocale();
      }
      // for detail
      if (this.container.mode) {
        options.containerMode = this.container.mode;
      }
      // stage
      options.stage = this.base_getCurrentStage();
      // options
      return options;
    },
    base_prepareSelectOptions() {
      // base on base_prepareReadOptions
      const options = this.base_prepareReadOptions();
      // where
      options.where = {};
      // search
      if (this.search.query) {
        options.where['a.atomName'] = { val: this.search.query, op: 'like' };
      }
      // select
      if (this.container.scene === 'select') {
        const selectedAtomIds = this.container.params?.selectedAtomIds;
        options.where['a.id'] = selectedAtomIds && selectedAtomIds.length > 0 ? selectedAtomIds : null;
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
        if (!atomOrderCurrent) {
          params.options.orders = null;
        } else {
          params.options.orders = [[this.order_getKey(atomOrderCurrent), atomOrderCurrent.by]];
        }
      }
      // ok
      return params;
    },
    base_getItems() {
      return this.data_getItems();
    },
    base_getCurrentStage() {
      let stage = this.$meta.util.getProperty(this.filter.data, 'form.stage');
      if (!stage) stage = this.container.options?.stage;
      if (!stage) {
        if (this.base.atomClassBase?.detail) {
          stage = undefined;
        } else {
          stage = 'formal';
        }
      }
      return stage;
    },
    base_getExportFields() {
      return this.$meta.util.getProperty(this.layout.configFull, 'info.export.fields');
    },
  },
};
