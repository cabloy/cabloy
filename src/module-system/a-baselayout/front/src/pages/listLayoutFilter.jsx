import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
import tabBasic from '../components/filter/tabBasic.jsx';

export default {
  mixins: [ebPageContext, ebAtomClasses],
  components: {
    tabBasic,
  },
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
    _getFilterTabOptions() {
      return {
        layoutManager: this.layoutManager,
        filterConfig: this.filterConfig,
        filterContainer: this,
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
      const domLinkBasic = this._renderNavbarSubLink('basic', 'Basic');
      // general
      const domLinkGeneral = this._renderNavbarSubLink('general', 'General');
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
            {domLinkCategory}
            {domLinkTag}
          </f7-toolbar>
        </f7-subnavbar>
      );
    },
    _renderTabs() {
      // options
      const options = this._getFilterTabOptions();
      // basic
      const domTabBasic = (
        <eb-tab-page-content
          id={this.tabId.basic}
          tabActive={this.tabName === 'basic'}
          data-ref="basic"
          onTabShow={() => {
            this.tabName = 'basic';
          }}
        >
          <tabBasic ref="basic" slot="list" options={options}></tabBasic>
        </eb-tab-page-content>
      );

      return <f7-tabs>{domTabBasic}</f7-tabs>;
      //   <f7-tabs ref="tabs">
      //   <eb-tab-page-content :id="tabId.mine" :tabActive="tabName === 'mine'" data-ref="mine" @tab:show="tabName = 'mine'">
      //     <flowTab ref="mine" slot="list" :container="getContainer('mine')"></flowTab>
      //   </eb-tab-page-content>
      //   <eb-tab-page-content :id="tabId.others" :tabActive="tabName === 'others'" data-ref="others" @tab:show="tabName = 'others'">
      //     <flowTab ref="others" slot="list" :container="getContainer('others')"></flowTab>
      //   </eb-tab-page-content>
      //   <eb-tab-page-content :id="tabId.history" :tabActive="tabName === 'history'" data-ref="history" @tab:show="tabName = 'history'">
      //     <flowTab ref="history" slot="list" :container="getContainer('history')"></flowTab>
      //   </eb-tab-page-content>
      // </f7-tabs>
    },
    _renderNavbarSubLink(tabName, tabNameTitle) {
      return (
        <eb-link tabLink={`#${this.tabId[tabName]}`} tabLinkActive={this.tabName === tabName}>
          {this.$text(tabNameTitle)}
        </eb-link>
      );
    },
  },
  render() {
    return (
      <eb-page page-content={false} tabs with-subnavbar>
        {this._renderNavbar()}
        {this._renderTabs()}
      </eb-page>
    );
  },
};
