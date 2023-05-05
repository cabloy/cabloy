import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;

const __groupRules = [
  {
    name: 'Business',
    title: 'AtomClassGroupBusiness',
    fn: atomClassBase => !atomClassBase.itemOnly && !atomClassBase.inner,
  },
  {
    name: 'Inner',
    title: 'AtomClassGroupInner',
    fn: atomClassBase => !atomClassBase.itemOnly && atomClassBase.inner,
  },
  {
    name: 'Runtime',
    title: 'AtomClassGroupRuntime',
    fn: atomClassBase => atomClassBase.itemOnly && !atomClassBase.detail,
  },
  {
    name: 'Detail',
    title: 'AtomClassGroupDetail',
    fn: atomClassBase => atomClassBase.itemOnly && atomClassBase.detail,
  },
];

export default {
  mixins: [ebModules, ebPageContext, ebAtomClasses],
  data() {
    return {
      query: null,
    };
  },
  computed: {
    pageTitle() {
      return this.$text('Select Atom Class');
    },
    ready() {
      return this.modulesAll && this.atomClassesAll;
    },
    selected() {
      return this.contextParams.selected;
    },
    optional() {
      return this.contextParams.optional;
    },
    check() {
      // itemOnly/inner/detail/simple/resource
      return this.contextParams.check || {};
    },
    // user() {
    //   return this.contextParams.user;
    // },
    // atomClasses_modeUser() {
    //   return this.user;
    // },
    atomClassesGroup() {
      // filter
      const atomClasses = this._prepareAtomClasses_filter();
      // group
      return this._prepareAtomClasses_group(atomClasses);
    },
  },
  created() {
    this.onSearchbarSearch = this.$meta.util.debounce((searchbar, query) => {
      this._onSearch(query);
    }, 300);
  },
  methods: {
    _prepareAtomClasses_filter() {
      const atomClasses = [];
      for (const moduleName in this.atomClassesAll) {
        const moduleBase = this.modulesAll[moduleName];
        const atomClassesModule = this.atomClassesAll[moduleName];
        for (const atomClassName in atomClassesModule) {
          const atomClassBase = atomClassesModule[atomClassName];
          const atomClassTitle = atomClassBase.title;
          const atomClassTitleLocale = atomClassBase.titleLocale;
          // filter: query
          if (
            this.query &&
            atomClassTitle.indexOf(this.query) === -1 &&
            atomClassTitleLocale.indexOf(this.query) === -1
          ) {
            continue;
          }
          // filter: itemOnly/inner/detail/simple/resource
          if (
            Object.keys(this.check).some(key => {
              return Boolean(this.check[key]) !== Boolean(atomClassBase[key]);
            })
          ) {
            continue;
          }
          // special case for a-base:role
          if (this.check.resource && moduleName === 'a-base' && atomClassName === 'role') {
            continue;
          }
          // push
          atomClasses.push({
            atomClassBase,
            moduleBase,
          });
        }
      }
      return atomClasses;
    },
    _prepareAtomClasses_group(atomClasses) {
      // group
      const _atomClassesGroup = atomClasses.group(item => {
        const groupRule = __groupRules.find(rule => rule.fn(item.atomClassBase));
        return groupRule.name;
      });
      // array
      let atomClassesGroup = [];
      for (const key in _atomClassesGroup) {
        const atomClasses = _atomClassesGroup[key];
        const index = __groupRules.findIndex(rule => rule.name === key);
        const group = {
          index,
          groupRule: __groupRules[index],
          children: atomClasses,
        };
        atomClassesGroup.push(group);
      }
      // sort
      atomClassesGroup = atomClassesGroup.sort((a, b) => a.index - b.index);
      // ok
      return atomClassesGroup;
    },
    onClickEnable() {
      this.$refs.searchbar.f7Searchbar.enable(true);
    },
    _onSearch(query) {
      this.query = query;
    },
    _renderContent() {
      if (!this.ready) return null;
      const atomClassesGroup = this.atomClassesGroup;
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.pageTitle} eb-back-link="Back">
          <f7-nav-right>
            <f7-link iconF7="::search" onClick={this.onClickEnable}></f7-link>
          </f7-nav-right>
          <f7-searchbar
            ref="searchbar"
            onSearchbarSearch={this.onSearchbarSearch}
            expandable
            search-container=".search-list"
            search-in=".item-title"
            placeholder={this.pageTitle}
            backdrop={false}
            disable-button={true}
            clear-button={true}
            custom-search={true}
          ></f7-searchbar>
        </eb-navbar>
        {this._renderContent()}
      </eb-page>
    );
  },
};
