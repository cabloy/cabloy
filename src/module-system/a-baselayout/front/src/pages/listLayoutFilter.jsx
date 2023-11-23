import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
import tabBasic from '../components/filter/tabBasic.jsx';
import tabGeneral from '../components/filter/tabGeneral.jsx';
import tabState from '../components/filter/tabState.jsx';
import tabCategory from '../components/filter/tabCategory.jsx';
import tabTag from '../components/filter/tabTag.jsx';

export default {
  mixins: [ebPageContext, ebAtomClasses],
  components: {
    tabBasic,
    tabGeneral,
    tabState,
    tabCategory,
    tabTag,
  },
  data() {
    return {
      tabId: {
        basic: Vue.prototype.$meta.util.nextId('basic'),
        general: Vue.prototype.$meta.util.nextId('general'),
        state: Vue.prototype.$meta.util.nextId('state'),
        category: Vue.prototype.$meta.util.nextId('category'),
        tag: Vue.prototype.$meta.util.nextId('tag'),
      },
      //
      form: null,
      formAtomClass: null,
      schemaBasic: null,
      schemaGeneral: null,
      schemaSearch: null,
      searchStatesBasic: null,
      searchStatesGeneral: null,
      searchStatesSearch: null,
      ready: false,
    };
  },
  computed: {
    pageTitle() {
      return this.$text('Filter');
    },
    filterComponentInstance() {
      return this.$refs.filter && this.$refs.filter.getComponentInstance();
    },
    immediate() {
      return this.contextParams.immediate;
    },
    layoutManager() {
      return this.contextParams.layoutManager;
    },
    filterConfig() {
      return this.contextParams.filterConfig;
    },
    // tabName
    tabName: {
      get() {
        return this.layoutManager.filter.tabNameCurrent || 'basic';
      },
      set(value) {
        this.layoutManager.filter.tabNameCurrent = value;
      },
    },
    //
    itemOnly() {
      return !!(this.layoutManager.base.atomClassBase && this.layoutManager.base.atomClassBase.itemOnly);
    },
    atomClass() {
      return this.form.atomClass;
    },
    atomClassBase() {
      if (!this.atomClass) return null;
      return this.getAtomClass(this.atomClass);
    },
    atomClassTitle() {
      if (!this.atomClass) return '';
      if (this.atomClass.title) return this.atomClass.title;
      const _atomClass = this.atomClassBase;
      if (!_atomClass) return '';
      return _atomClass.titleLocale;
    },
    stage() {
      return this.form.stage;
    },
    stages() {
      const stages = [];
      const atomClassBase = this.atomClassBase;
      for (const key of ['draft', 'formal', 'history']) {
        if (atomClassBase && atomClassBase.simple && key === 'draft') continue;
        if (atomClassBase && atomClassBase.history === false && key === 'history') continue;
        stages.push({ title: key.replace(key[0], key[0].toUpperCase()), value: key });
      }
      return stages;
    },
    atomStateDict() {
      const useStoreAtomState = Vue.prototype.$meta.store.useSync('a/basestore/atomState');
      if (!useStoreAtomState) return null;
      const dict = useStoreAtomState.getDictSync({
        atomClass: this.atomClass,
        atomStage: this.stage,
      });
      return dict;
    },
  },
  watch: {
    'form.atomClass': function (valNew, valOld) {
      if (!this.ready) return;
      if (this._getAtomClassFullName(valNew) === this._getAtomClassFullName(valOld)) return;
      // clear some fields: formAtomClass/language/categoryId/tags
      this.formAtomClass = {};
      this.form = {
        ...this.form,
        language: '',
        category: 0,
        tag: 0,
      };
      this.atomClassChanged();
    },
    'form.language': function (valNew, valOld) {
      if (!this.ready) return;
      if (valNew === valOld) return;
      // clear some fields: categoryId/tags
      this.form = {
        ...this.form,
        category: 0,
        tag: 0,
      };
    },
    form: {
      handler() {
        if (!this.ready) return;
        this.onFilterChanged();
      },
      deep: true,
    },
    formAtomClass: {
      handler() {
        if (!this.ready) return;
        this.onFilterChanged();
      },
      deep: true,
    },
  },
  mounted() {
    this.layoutManager.$on('layoutManager:destroy', this.onLayoutManagerDestroy);
  },
  beforeDestroy() {
    this.layoutManager.$off('layoutManager:destroy', this.onLayoutManagerDestroy);
  },
  created() {
    this.onFilterDebounce = this.$meta.util.debounce(() => {
      this._onFilterDebounce();
    }, 300);
    // filter data
    const filterData = this.$meta.util.getProperty(this.layoutManager, 'filter.data');
    this.form = this.$meta.util.extend({}, filterData.form);
    this.formAtomClass = this.$meta.util.extend({}, filterData.formAtomClass);
    this.schemaBasic = filterData.schemaBasic;
    this.schemaGeneral = filterData.schemaGeneral;
    this.schemaSearch = filterData.schemaSearch;
    this.searchStatesBasic = filterData.searchStatesBasic;
    this.searchStatesGeneral = filterData.searchStatesGeneral;
    this.searchStatesSearch = filterData.searchStatesSearch;
  },
  methods: {
    _getAtomClassFullName(atomClass) {
      if (!atomClass) return null;
      return `${atomClass.module}:${atomClass.atomClassName}`;
    },
    onAtomClassesReady() {
      this.init();
    },
    async init() {
      // init atomClass
      await this.atomClassChanged(true);
      //
      this.ready = true;
    },
    async loadSchemaSearch(atomClass) {
      this.schemaSearch = await this.layoutManager.filter_loadSchemaSearch(atomClass);
    },
    async atomClassChanged(first) {
      const atomClass = this.atomClass;
      if (!atomClass) {
        // reset
        this.schemaSearch = null;
      } else {
        // switch
        // schemaSearch
        if (!first) {
          await this.loadSchemaSearch(atomClass);
        }
      }
    },
    onFormSubmit() {
      if (this.immediate) {
        // donothing
      } else {
        this.onPerformSearch();
      }
    },
    onPerformSearch() {
      this.onFilterChanged(true);
      this.$f7router.back();
    },
    onFilterChanged(force) {
      if (!this.ready) return;
      if (force || this.immediate) {
        this.onFilterDebounce();
      }
    },
    _onFilterDebounce() {
      this.layoutManager.filter_onChanged({
        form: this.form,
        formAtomClass: this.formAtomClass,
        schemaBasic: this.schemaBasic,
        schemaGeneral: this.schemaGeneral,
        schemaSearch: this.schemaSearch,
        searchStatesBasic: this.searchStatesBasic,
        searchStatesGeneral: this.searchStatesGeneral,
        searchStatesSearch: this.searchStatesSearch,
      });
    },
    onLayoutManagerDestroy() {
      this.$view.close();
    },
    async onPerformSelectLanguage() {
      const action = {
        actionModule: 'a-base',
        actionComponent: 'action',
        name: 'selectLocale',
      };
      // when need locale, throw error on no selection
      const locale = await this.$meta.util.performAction({ ctx: this, action });
      if (locale) {
        this.form = {
          ...this.form,
          language: locale.value,
        };
      }
    },
    _getFormHost() {
      const host = {
        hint: false,
        container: this.layoutManager.container,
        atomClassBase: this.atomClassBase,
        stages: this.stages,
        stage: this.stage,
        immediate: this.immediate,
      };
      return host;
    },
    _renderNavbarItemOnly() {
      const domNavbarRight = this._renderNavbarRight();
      return (
        <eb-navbar title={this.pageTitle} eb-back-link="Back">
          {domNavbarRight}
        </eb-navbar>
      );
    },
    _renderNavbar() {
      const domNavbarRight = this._renderNavbarRight();
      const domNavbarSub = this._renderNavbarSub();
      return (
        <eb-navbar title={this.pageTitle} eb-back-link="Back">
          {domNavbarRight}
          {domNavbarSub}
        </eb-navbar>
      );
    },
    _renderNavbarRight() {
      let domButtonSearch;
      if (!this.immediate) {
        domButtonSearch = <eb-link ref="buttonSubmit" iconF7="::done" propsOnPerform={this.onPerformSearch}></eb-link>;
      }
      return <f7-nav-right>{domButtonSearch}</f7-nav-right>;
    },
    _renderNavbarSub() {
      // basic
      const domLinkBasic = this._renderNavbarSubLink('basic', 'Basic');
      // general
      const domLinkGeneral = this._renderNavbarSubLink('general', 'General');
      // state: not support history
      let domLinkState;
      if (this.atomStateDict) {
        domLinkState = this._renderNavbarSubLink('state', 'State');
      }
      // category
      let domLinkCategory;
      if (this.atomClassBase && this.atomClassBase.category) {
        domLinkCategory = this._renderNavbarSubLink('category', 'Category');
      }
      // tag
      let domLinkTag;
      if (this.atomClassBase && this.atomClassBase.tag) {
        domLinkTag = this._renderNavbarSubLink('tag', 'Tag');
      }
      return (
        <f7-subnavbar>
          <f7-toolbar top tabbar>
            {domLinkBasic}
            {domLinkGeneral}
            {domLinkState}
            {domLinkCategory}
            {domLinkTag}
          </f7-toolbar>
        </f7-subnavbar>
      );
    },
    _renderTabItemOnly() {
      if (!this.ready) return;
      return (
        <tabBasic
          layoutManager={this.layoutManager}
          filterConfig={this.filterConfig}
          filterContainer={this}
          itemOnly={true}
        ></tabBasic>
      );
    },
    _renderTabs() {
      if (!this.ready) return;
      // basic
      const domTabBasic = this._renderTab('basic', 'tabBasic');
      // general
      const domTabGeneral = this._renderTab('general', 'tabGeneral');
      // state
      let domTabState;
      if (this.atomStateDict) {
        domTabState = this._renderTab('state', 'tabState');
      }
      // category
      let domTabCategory;
      if (this.atomClassBase && this.atomClassBase.category) {
        domTabCategory = this._renderTab('category', 'tabCategory');
      }
      // tag
      let domTabTag;
      if (this.atomClassBase && this.atomClassBase.tag) {
        domTabTag = this._renderTab('tag', 'tabTag');
      }
      return (
        <f7-tabs>
          {domTabBasic}
          {domTabGeneral}
          {domTabState}
          {domTabCategory}
          {domTabTag}
        </f7-tabs>
      );
    },
    _renderNavbarSubLink(tabName, tabNameTitle) {
      return (
        <eb-link tabLink={`#${this.tabId[tabName]}`} tabLinkActive={this.tabName === tabName}>
          {this.$text(tabNameTitle)}
        </eb-link>
      );
    },
    _renderTab(tabName, TabTag) {
      return (
        <f7-tab
          id={this.tabId[tabName]}
          class="page-content"
          tabActive={this.tabName === tabName}
          onTabShow={() => {
            this.tabName = tabName;
          }}
        >
          <TabTag layoutManager={this.layoutManager} filterConfig={this.filterConfig} filterContainer={this}></TabTag>
        </f7-tab>
      );
    },
  },
  render() {
    const pageContent = this.itemOnly;
    const tabs = !this.itemOnly;
    // const withSubnavbar = !this.itemOnly; // no need
    const domChildren = [];
    if (this.itemOnly) {
      domChildren.push(this._renderNavbarItemOnly());
      domChildren.push(this._renderTabItemOnly());
    } else {
      domChildren.push(this._renderNavbar());
      domChildren.push(this._renderTabs());
    }
    return (
      <eb-page page-content={pageContent} tabs={tabs}>
        {domChildren}
      </eb-page>
    );
  },
};
