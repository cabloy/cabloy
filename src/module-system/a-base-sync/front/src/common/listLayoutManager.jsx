import ebAtomClasses from './atomClasses.js';
export default {
  mixins: [ ebAtomClasses ],
  data() {
    return {
      ready: false,
      layoutCurrent: null,
      layoutConfig: null,
      configAtomBase: null,
      configAtom: null,
      filter: null,
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
      return this.$store.getters['a/base/userLabels'];
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
    this.$store.dispatch('a/base/getLabels');
    //
    this.layoutCurrent = this.layout || this.getLayout();
    //
    this.prepareLayoutConfig().then(() => {
      this.ready = true;
    });
  },
  render() {
    return (
      <eb-page ptr onPtrRefresh={this.onPageRefresh} infinite infinitePreloader={false} onInfinite={this.onPageInfinite}>
        <eb-navbar title={this.getPageTitle()} eb-back-link="Back">
          {this._renderBlock({ blockName: 'title' })}
        </eb-navbar>
        {this._renderLayout()}
      </eb-page>
    );
  },
  methods: {
    onPageRefresh(done) {
      done && done();
      this.layoutComponentInstance && this.layoutComponentInstance.onPageRefresh();
    },
    onPageInfinite() {
      this.layoutComponentInstance && this.layoutComponentInstance.onPageInfinite();
    },
    onPerformFilter() {
      const filterConfig = this._getFilterConfig();
      this.$view.navigate('/a/baselayout/listLayoutFilter', {
        scene: 'sidebar',
        sceneOptions: { side: 'right', name: 'filter', title: 'Filter' },
        context: {
          params: {
            layoutManager: this,
            filterConfig,
          },
        },
      });
    },
    onFilterChanged(value) {
      this.filter = value;
      // reload
      this.onPageRefresh();
    },
    onPerformAtomOrders(element) {
      const popover = this.$refs.popoverAtomOrders.$el;
      this.$f7.popover.open(popover, element);
    },
    onPerformChangeAtomOrder(event, atomOrder) {
      // switch
      const atomOrderCurrent = this.atomOrderSelected || this.atomOrderDefault;
      if (this._getAtomOrderKey(atomOrderCurrent) === this._getAtomOrderKey(atomOrder)) {
        this.atomOrderSelected = {
          name: atomOrderCurrent.name,
          tableAlias: atomOrderCurrent.tableAlias,
          by: atomOrderCurrent.by === 'desc' ? 'asc' : 'desc',
        };
      } else {
        this.atomOrderSelected = atomOrder;
      }
      // reload
      this.onPageRefresh();
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
        [ this._getAtomOrderKey(atomOrderCurrent), atomOrderCurrent.by ],
      ];
      // extend 1
      if (this.options) {
        options = this.$utils.extend({}, options, this.options);
      }
      // options
      return options;
    },
    prepareSelectParams() {
      // options
      const options = this.prepareSelectOptions();
      // params
      let params = {
        atomClass: this.atomClass,
        options,
      };
      // filter
      const filterParams = this.prepareFilterParams();
      if (filterParams) {
        params = this.$utils.extend({}, params, filterParams);
      }
      return params;
    },
    prepareFilterParams() {
      if (!this.filter) return null;
      // options
      const options = {
        where: {},
      };
      // params
      const params = {
        options,
      };
      // form
      if (this.filter.form) {
        if (this.filter.form.atomName) {
          options.where['a.atomName'] = { val: this.filter.form.atomName, op: 'like' };
        }
        if (this.filter.form.star) {
          options.star = Number(this.filter.form.star);
        }
        if (this.filter.form.label) {
          options.label = this.filter.form.label;
        }
        if (this.filter.form.stage) {
          options.stage = this.filter.form.stage;
        }
        if (this.filter.form.atomClass) {
          params.atomClass = this.filter.form.atomClass;
        }
      }
      // formAtomClass
      const formAtomClass = this.filter.formAtomClass;
      if (formAtomClass) {
        let hasValue = false;
        for (const key in formAtomClass) {
          const value = formAtomClass[key];
          // undefined/null/'', except 0/false
          if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'string') {
              options.where[`f.${key}`] = { val: value, op: 'like' };
            } else {
              options.where[`f.${key}`] = value;
            }
            hasValue = true;
          }
        }
        if (hasValue) {
          options.mode = 'search';
        }
      }
      // ok
      return params;
    },
    _getAtomOrderKey(atomOrder) {
      return atomOrder ? `${atomOrder.tableAlias || 'f'}.${atomOrder.name}` : null;
    },
    _getAtomOrderStatus(atomOrder) {
      const atomOrderCurrent = this.atomOrderSelected || this.atomOrderDefault;
      if (this._getAtomOrderKey(atomOrderCurrent) === this._getAtomOrderKey(atomOrder)) {
        return atomOrderCurrent.by === 'desc' ? 'arrow_drop_down' : 'arrow_drop_up';
      }
      return '';
    },
    _getAtomOrders() {
      // base
      const ordersBase = this.configAtomBase.render.list.info.orders;
      // atomClass
      const ordersAtomClass = this.$meta.util.getProperty(this.configAtom, 'render.list.info.orders');
      // atomOrders
      return ordersAtomClass ? ordersBase.concat(ordersAtomClass) : ordersBase;
    },
    _getFilterConfig() {
      // base
      const filterConfigBase = this.configAtomBase.render.list.info.filter;
      // atomClass
      const filterConfig = this.$meta.util.getProperty(this.configAtom, 'render.list.info.filter');
      // filterConfig
      return this.$meta.util.extend({}, filterConfigBase, filterConfig);
    },
    async prepareLayoutConfig() {
      // configAtomBase
      this.configAtomBase = this.$config.atom;
      // configAtom
      if (this.atomClass) {
        // load module
        await this.$meta.module.use(this.atomClass.module);
        this.configAtom = this.$meta.util.getProperty(this.$meta.config.modules[this.atomClass.module], `atoms.${this.atomClass.atomClassName}`);
      }
      // layoutConfig
      const layoutConfigBase = this.configAtomBase.render.list.layouts[this.layoutCurrent];
      const layoutConfigAtom = this.$meta.util.getProperty(this.configAtom, `render.list.layouts.${this.layoutCurrent}`);
      this.layoutConfig = this.$meta.util.extend({}, layoutConfigBase, layoutConfigAtom);
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
    _renderPopoverAtomOrders() {
      if (!this.ready) return null;
      // list
      const children = [];
      for (const atomOrder of this._getAtomOrders()) {
        children.push(
          <eb-list-item key={this._getAtomOrderKey(atomOrder)} popoverClose link="#" propsOnPerform={$event => { this.onPerformChangeAtomOrder($event, atomOrder); }}>
            <f7-icon slot="media" material={this._getAtomOrderStatus(atomOrder)}></f7-icon>
            <div slot="title">{this.$text(atomOrder.title)}</div>
          </eb-list-item>
        );
      }
      const domList = (
        <f7-list inset>
          {children}
        </f7-list>
      );
      return (
        <eb-popover ref="popoverAtomOrders" ready={true}>
          {domList}
        </eb-popover>
      );
    },
    getBlockComponentOptions({ blockConfig }) {
      return {
        props: {
          layoutManager: this,
          blockConfig,
        },
      };
    },
    _renderBlock({ blockName }) {
      if (!this.ready) return null;
      const blockConfig = this.layoutConfig.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
    _renderLayout() {
      return (
        <div>
          {this._renderLayoutComponent()}
          {this._renderPopoverAtomOrders()}
        </div>
      );
    },
  },
};
