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
    atomClassesGroups() {
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
    onPerformClearAtomClass() {
      this.contextCallback(200, null);
      this.$f7router.back();
    },
    onPerformItemClick(event, item) {
      const { atomClass, atomClassBase } = item;
      const data = {
        ...atomClass,
        title: atomClassBase.title,
        titleLocale: atomClassBase.titleLocale,
      };
      this.contextCallback(200, data);
      this.$f7router.back();
    },
    _prepareAtomClasses_filter() {
      const atomClasses = [];
      for (const moduleName in this.atomClassesAll) {
        const moduleBase = this.modulesAll[moduleName];
        const atomClassesModule = this.atomClassesAll[moduleName];
        for (const atomClassName in atomClassesModule) {
          const atomClass = {
            module: moduleName,
            atomClassName,
          };
          const atomClassBase = atomClassesModule[atomClassName];
          const atomClassTitle = atomClassBase.title;
          const atomClassTitleLocale = atomClassBase.titleLocale;
          // filter: query
          const query = this.query && this.query.toLowerCase();
          if (
            query &&
            atomClassTitle.toLowerCase().indexOf(query) === -1 &&
            atomClassTitleLocale.toLowerCase().indexOf(query) === -1
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
            atomClass,
            atomClassBase,
            moduleBase,
          });
        }
      }
      return atomClasses;
    },
    _prepareAtomClasses_group(atomClasses) {
      // group
      const _atomClassesGroups = atomClasses.group(item => {
        const groupRule = __groupRules.find(rule => rule.fn(item.atomClassBase));
        return groupRule.name;
      });
      // array
      let atomClassesGroups = [];
      for (const key in _atomClassesGroups) {
        const atomClasses = _atomClassesGroups[key];
        const index = __groupRules.findIndex(rule => rule.name === key);
        const group = {
          index,
          groupRule: __groupRules[index],
          children: atomClasses,
        };
        atomClassesGroups.push(group);
      }
      // sort
      atomClassesGroups = atomClassesGroups.sort((a, b) => a.index - b.index);
      // ok
      return atomClassesGroups;
    },
    onClickEnable() {
      this.$refs.searchbar.f7Searchbar.enable(true);
    },
    _onSearch(query) {
      this.query = query;
    },
    _renderClearButton() {
      if (!this.optional || !this.selected) {
        return null;
      }
      return (
        <eb-button propsOnPerform={event => this.onPerformClearAtomClass(event)}>
          {this.$text('ClearAtomClass')}
        </eb-button>
      );
    },
    _renderGroup(group) {
      const children = [];
      for (const item of group.children) {
        const { atomClass, atomClassBase, moduleBase } = item;
        const checked =
          this.selected &&
          this.selected.module === atomClass.module &&
          this.selected.atomClassName === atomClass.atomClassName;
        const domItem = (
          <eb-list-item
            class="item"
            key={`${atomClass.module}:${atomClass.atomClassName}`}
            radio
            checked={checked}
            title={atomClassBase.titleLocale}
            propsOnPerform={event => this.onPerformItemClick(event, item)}
          >
            <div slot="after">{moduleBase.titleLocale}</div>
          </eb-list-item>
        );

        children.push(domItem);
      }
      return <eb-list inset>{children}</eb-list>;
    },
    _renderAccordion(group /* , index*/) {
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{this.$text(group.groupRule.title)}</div>
        </div>
      );
      // domAccordionContent
      const domGroup = this._renderGroup(group);
      const domAccordionContent = <f7-accordion-content>{domGroup}</f7-accordion-content>;
      // ok
      return (
        <eb-list-item key={group.groupRule.name} accordion-item accordion-item-opened={true}>
          {domTitle}
          {domAccordionContent}
        </eb-list-item>
      );
    },
    _renderAccordions() {
      if (!this.ready) return null;
      const groups = this.atomClassesGroups;
      const children = [];
      // single
      if (groups.length === 1) {
        return this._renderGroup(groups[0]);
      }
      // more
      for (let index = 0; index < groups.length; index++) {
        children.push(this._renderAccordion(groups[index], index));
      }
      return (
        <eb-list accordion-list class="eb-accordion-list">
          {children}
        </eb-list>
      );
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
        {this._renderClearButton()}
        {this._renderAccordions()}
      </eb-page>
    );
  },
};
