import ebAtomClasses from './atomClasses.js';
import ebMenus from './menus.js';
export default {
  mixins: [ ebAtomClasses, ebMenus ],
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
      searchQuery: null,
      actionsCreate: null,
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
      if (this.options && this.options.star) {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'd',
        };
      } else if (this.options && this.options.label) {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'e',
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
    showPopoverActionsCreate() {
      return this.actionsCreate && this.actionsCreate.length > 0;
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

      this.loadActionsCreate();
    });
  },
  methods: {
    onPageRefresh(done) {
      done && done();
      this.layoutComponentInstance && this.layoutComponentInstance.onPageRefresh(true);
    },
    onPageInfinite() {
      this.layoutComponentInstance && this.layoutComponentInstance.onPageInfinite();
    },
    onPageClear() {
      this.layoutComponentInstance && this.layoutComponentInstance.onPageClear();
    },
    onPerformFilter() {
      const $el = this.$$(this.$el);
      const $view = $el.parents('.eb-layout-view');
      const isPanel = $view.is('.eb-layout-panel-view');
      const immediate = this.$meta.vueApp.layout === 'pc' && !isPanel;
      const filterConfig = this._getFilterConfig();
      const navigateOptions = {
        context: {
          params: {
            layoutManager: this,
            filterConfig,
            immediate,
          },
        },
      };
      if (immediate) {
        navigateOptions.scene = 'sidebar';
        navigateOptions.sceneOptions = { side: 'right', name: 'filter', title: 'Filter' };
      } else {
        navigateOptions.target = '_self';
      }
      this.$view.navigate('/a/baselayout/listLayoutFilter', navigateOptions);
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
    onPerformActionsCreate(element) {
      const popover = this.$refs.popoverActionsCreate.$el;
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
    onActionsCreateAction(event, action) {
      let _menu = this.getMenu(action);
      if (!_menu) return;
      if (_menu.action === 'create') {
        action = {
          atomClassId: action.atomClassId,
          module: action.module,
          atomClassName: action.atomClassName,
          atomClassIdParent: action.atomClassIdParent,
        };
        _menu = this.$utils.extend({}, _menu, { targetEl: event.target });
      }
      this.$meta.util.performAction({ ctx: this, action: _menu, item: action });
    },
    getLayout() {
      return this.$view.size === 'small' ? 'list' : 'table';
    },
    prepareSelectOptions() {
      // options
      let options = {
        where: { },
      };
      // search
      if (this.searchQuery) {
        options.where['a.atomName'] = { val: this.searchQuery, op: 'like' };
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
    // **  search - begin
    onSearch(query) {
      this.searchQuery = query;
      if (this.searchQuery) {
        this.onPageRefresh();
      } else {
        this.onPageClear();
      }
    },
    onSearchDisable() {
      this.$f7router.back();
    },
    onSearchAdvanced() {
      this.onPerformFilter();
    },
    // ** search - end
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
    loadActionsCreate() {
      if (this.atomClass) return;
      // functionList
      const options = {
        where: { menu: 1, sceneName: 'create' },
        orders: [
          [ 'sorting', 'asc' ],
        ],
      };
      this.$api.post('/a/base/function/list', {
        options,
      }).then(data => {
        this.actionsCreate = data.list;
      });
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
          <eb-list-item key={this._getAtomOrderKey(atomOrder)} popoverClose link="#" propsOnPerform={event => this.onPerformChangeAtomOrder(event, atomOrder)}>
            <f7-icon slot="media" material={this._getAtomOrderStatus(atomOrder)}></f7-icon>
            <div slot="title">{this.$text(atomOrder.title)}</div>
          </eb-list-item>
        );
      }
      return (
        <eb-popover ref="popoverAtomOrders" ready={true}>
          <f7-list inset>
            {children}
          </f7-list>
        </eb-popover>
      );
    },
    _renderPopoverActionsCreate() {
      if (!this.showPopoverActionsCreate) return null;
      // list
      const children = [];
      for (const action of this.actionsCreate) {
        children.push(
          <eb-list-button key={action.id} popoverClose propsOnPerform={event => this.onActionsCreateAction(event, action)}>{action.titleLocale}</eb-list-button>
        );
      }
      return (
        <f7-popover ref="popoverActionsCreate">
          <f7-list inset>
            {children}
          </f7-list>
        </f7-popover>
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
          {this._renderPopoverActionsCreate()}
        </div>
      );
    },
  },
};
