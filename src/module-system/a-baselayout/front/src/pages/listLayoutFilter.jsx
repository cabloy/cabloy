import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
export default {
  mixins: [ebPageContext, ebAtomClasses],
  data() {
    return {
      tabId: {
        basic: Vue.prototype.$meta.util.nextId('basic'),
        general: Vue.prototype.$meta.util.nextId('general'),
        category: Vue.prototype.$meta.util.nextId('category'),
        tag: Vue.prototype.$meta.util.nextId('tag'),
      },
      tabName: 'basic',
      //
      form: null,
      formAtomClass: null,
      schemaSearch: null,
      categoriesAll: null,
      tagsAll: null,
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
    //
    userLabels() {
      const labelsAll = this.$store.getters['a/base/userLabels'];
      if (!labelsAll) return null;

      const labels = [{ title: '', value: 0 }];
      for (const key in labelsAll) {
        labels.push({ title: labelsAll[key].text, value: key });
      }
      return labels;
    },
    locales() {
      const locales = this.$store.getState('a/base/locales');
      if (!locales) return [];
      return [{ title: '', value: '' }].concat(locales);
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
    stages() {
      const stages = [];
      const atomClassBase = this.atomClassBase;
      for (const key of ['draft', 'formal', 'history']) {
        if (atomClassBase && atomClassBase.simple && key === 'draft') continue;
        stages.push({ title: key.replace(key[0], key[0].toUpperCase()), value: key });
      }
      return stages;
    },
  },
  watch: {
    form: {
      handler() {
        this.onFilterChanged();
      },
      deep: true,
    },
    formAtomClass: {
      handler() {
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
    // filter data
    const filterData = this.$meta.util.getProperty(this.layoutManager, 'filter.data');
    this.form = filterData.form;
    this.formAtomClass = filterData.formAtomClass;
    this.schemaSearch = filterData.schemaSearch;
  },
  methods: {
    onAtomClassesReady() {
      this.init();
    },
    async init() {
      // labels
      await this.$store.dispatch('a/base/getLabels');
      // locales
      await this.$store.dispatch('a/base/getLocales');
      // init atomClass
      await this.atomClassChanged(true);
      //
      this.ready = true;
    },
    async loadCategoriesAll(language) {
      const atomClassBase = this.atomClassBase;
      if (!atomClassBase || !atomClassBase.category) return;
      this.categoriesAll = await this.$store.dispatch('a/base/getCategories', {
        atomClass: this.atomClass,
        language,
      });
    },
    async loadTagsAll(language) {
      const atomClassBase = this.atomClassBase;
      if (!atomClassBase || !atomClassBase.tag) return;
      this.tagsAll = await this.$store.dispatch('a/base/getTags', {
        atomClass: this.atomClass,
        language,
      });
    },
    async loadSchemaSearch(atomClass) {
      this.schemaSearch = await this.layoutManager.filter_loadSchemaSearch(atomClass);
    },
    async atomClassChanged(first) {
      const atomClass = this.atomClass;
      if (!atomClass) {
        // reset
        this.categoriesAll = null;
        this.tagsAll = null;
        this.schemaSearch = null;
      } else {
        // switch
        // categories
        await this.loadCategoriesAll(this.form.language);
        // tags
        await this.loadTagsAll(this.form.language);
        // schemaSearch
        if (!first) {
          await this.loadSchemaSearch(atomClass);
        }
      }
    },
    onPerformSearch() {
      this.onFilterChanged(true);
      this.$f7router.back();
    },
    onFilterChanged(force) {
      if (force || this.immediate) {
        this.onFilterDebounce();
      }
    },
    onFilterDebounce: Vue.prototype.$meta.util.debounce(function () {
      this.layoutManager.filter_onChanged({
        form: this.form,
        formAtomClass: this.formAtomClass,
        schemaSearch: this.schemaSearch,
      });
    }, 300),
    onLayoutManagerDestroy() {
      this.$view.close();
    },
    _getFilterComponentOptions() {
      return {
        props: {
          layoutManager: this.layoutManager,
          filterConfig: this.filterConfig,
          filterContainer: this,
        },
      };
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
        domButtonSearch = <eb-link ref="buttonSubmit" iconMaterial="search" propsOnPerform={this.onPerformSearch}></eb-link>;
      }
      return <f7-nav-right>{domButtonSearch}</f7-nav-right>;
    },
    _renderNavbarSub() {
      // basic
      const domLinkBasic = (
        <eb-link tabLink={`#${this.tabId.basic}`} tabLinkActive={this.tabName === 'basic'}>
          {this.$text('Basic')}
        </eb-link>
      );
      // general
      const domLinkGeneral = (
        <eb-link tabLink={`#${this.tabId.general}`} tabLinkActive={this.tabName === 'general'}>
          {this.$text('General')}
        </eb-link>
      );
      // category
      let domLinkCategory;

      return (
        <f7-subnavbar>
          <f7-toolbar top tabbar>
            {domLinkBasic}
            {domLinkGeneral}
          </f7-toolbar>
        </f7-subnavbar>
      );
    },
  },
  render() {
    let domComponent;
    if (this.ready) {
      const filterConfig = this.contextParams.filterConfig;
      domComponent = <eb-component ref="filter" module={filterConfig.component.module} name={filterConfig.component.name} options={this._getFilterComponentOptions()}></eb-component>;
    }
    return (
      <eb-page>
        {this.ready && this._renderNavbar()}
        {domComponent}
      </eb-page>
    );
  },
};
