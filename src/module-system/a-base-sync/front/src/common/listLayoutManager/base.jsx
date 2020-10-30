export default {
  data() {
    return {
      base: {
        ready: false,
        configAtomBase: null,
        configAtom: null,
        config: null,
      },
    };
  },
  computed: {
    base_user() {
      return this.$store.state.auth.user.op;
    },
    base_userLabels() {
      return this.$store.getters['a/base/userLabels'];
    },
  },
  created() {
    this.$store.dispatch('a/base/getLabels');
  },
  methods: {
    base_prepareReadOptions() {
      // options
      const options = {
      };
      // layout
      options.layout = this.layout.current;
      // options
      return options;
    },
    base_prepareSelectOptions() {
      // options
      let options = {
        where: { },
      };
      // layout
      options.layout = this.layout.current;
      // search
      if (this.search.query) {
        options.where['a.atomName'] = { val: this.search.query, op: 'like' };
      }
      // select
      if (this.container.scene === 'select') {
        options.where['a.id'] = this.container.params.selectedAtomIds.length > 0 ? this.container.params.selectedAtomIds : null;
      }
      // mine
      if (this.container.scene === 'mine') {
        options.where['a.userIdCreated'] = this.base_user.id;
      }
      // order
      const atomOrderCurrent = this.order.selected || this.order_default;
      options.orders = [
        [ this.order_getKey(atomOrderCurrent), atomOrderCurrent.by ],
      ];
      // extend 1
      if (this.container.options) {
        options = this.$utils.extend({}, options, this.container.options);
      }
      // options
      return options;
    },
    base_prepareSelectParams() {
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
      return params;
    },
    base_getItems() {
      return this.layout.instance ? this.layout.instance.getItems() : [];
    },
    base_getCurrentStage() {
      let stage = this.$meta.util.getProperty(this.filter.data, 'form.stage');
      if (!stage) stage = this.container.options && this.container.options.stage;
      if (!stage) stage = 'archive';
      return stage;
    },
    base_getExportFields() {
      return this.$meta.util.getProperty(this.base.config, 'render.list.info.export.fields');
    },
  },
};
