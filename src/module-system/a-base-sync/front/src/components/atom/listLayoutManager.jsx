import ebAtomClasses from '../../common/atomClasses.js';
export default {
  meta: {
    global: false,
  },
  mixins: [ ebAtomClasses ],
  props: {
    // default/select/selecting
    scene: {
      type: String,
    },
    options: {
      type: String,
    },
    layout: {
      type: String,
    },
    atomClass: {
      type: Object,
    },
    params: {
      type: Object,
    },
  },
  data() {
    return {
      ready: false,
      layout2: null,
      layoutConfig: null,
      filter: null,
      filterOptions: null,
      atomOrderSelected: null,
      selectedAtomIds: null,
      selectedAtoms: null,
    };
  },
  computed: {
    layoutComponentInstance() {
      return this.$refs.layout && this.$refs.layout.getComponentInstance();
    },
    userLabels() {
      return this.$local.getters('userLabels');
    },
    atomOrders() {
      if (!this.ordersAll) return null;
      // base
      const ordersBase = this.getOrdersOfBase();
      // atomClass
      const ordersAtomClass = this.atomClass ? this.getOrdersOfAtomClass(this.atomClass) : null;
      // atomOrders
      return ordersAtomClass ? ordersBase.concat(ordersAtomClass) : ordersBase;
    },
    atomOrderDefault() {
      let atomOrder;
      if (this.scene === 'select') {
        atomOrder = {
          name: 'atomName',
          by: 'asc',
          tableAlias: 'a',
        };
      } else {
        // others
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'a',
        };
      }
      // ok
      return atomOrder;
    },
  },
  created() {
    //
    this.$local.dispatch('getLabels');
    //
    this.layout2 = this.layout || this.getLayout();
    //
    this.getLayoutConfig().then(res => {
      this.layoutConfig = res;
      this.ready = true;
    });
  },
  methods: {
    onPageRefresh() {
      this.layoutComponentInstance && this.layoutComponentInstance.onPageRefresh();
    },
    onPageInfinite() {
      this.layoutComponentInstance && this.layoutComponentInstance.onPageInfinite();
    },
    getLayout() {
      return this.$view.size === 'small' ? 'list' : 'table';
    },
    prepareSelectOptions() {
      // options
      let options;
      if (this.scene === 'select') {
        // where
        const where = {};
        if (!this.selectedAtomIds) {
          this.selectedAtomIds = this.params.selectedAtomIds || [];
        }
        where['a.id'] = this.selectedAtomIds.length > 0 ? this.selectedAtomIds : null;
        // options
        options = {
          where,
        };
      } else {
        // default
        options = {
          where: { },
        };
      }
      // order
      const atomOrderCurrent = this.atomOrderSelected || this.atomOrderDefault;
      options.orders = [
        [ this.getAtomOrderKey(atomOrderCurrent), atomOrderCurrent.by ],
      ];
      // extend 1
      if (this.options) {
        options = this.$utils.extend({}, options, this.options);
      }
      // extend 2
      if (this.filterOptions) {
        options = this.$utils.extend({}, options, this.filterOptions);
      }
      // options
      return options;
    },
    prepareSelectParams() {
      const options = this.prepareSelectOptions();
      return {
        atomClass: this.atomClass,
        options,
      };
    },
    getAtomOrderKey(atomOrder) {
      return atomOrder ? `${atomOrder.tableAlias}.${atomOrder.name}` : null;
    },
    async getLayoutConfig() {
      const layoutConfig = this.$config.atom.render.list.layout[this.layout2];
      let layoutConfigAtom;
      if (this.atomClass) {
        // load module
        await this.$meta.module.use(this.atomClass.module);
        // config
        const configAtom = this.$meta.config.modules[this.atomClass.module];
        layoutConfigAtom = configAtom && configAtom.atoms && configAtom.atoms[this.atomClass.atomClassName];
        layoutConfigAtom = layoutConfigAtom && layoutConfigAtom.render && layoutConfigAtom.render.list && layoutConfigAtom.render.list.layout;
        layoutConfigAtom = layoutConfigAtom && layoutConfigAtom[this.layout2];
      }
      return this.$meta.util.extend({}, layoutConfig, layoutConfigAtom);
    },
    getPageTitle() {
      const atomClass = this.getAtomClass(this.atomClass);
      if (!atomClass) return this.$text('Atom');
      return `${this.$text('Atom')}: ${atomClass.titleLocale}`;
    },
    getLayoutComponentOptions() {
      return {
        props: {
          layoutManager: this,
          layoutConfig: this.layoutConfig,
        },
      };
    },
    _renderLayoutComponent() {
      if (!this.ready) return null;
      return <eb-component ref='layout' module={this.layoutConfig.component.module} name={this.layoutConfig.component.name} options={this.getLayoutComponentOptions()}></eb-component>;
    },
  },
  render() {
    return (
      <div>
        {this._renderLayoutComponent()}
      </div>
    );
  },
};
