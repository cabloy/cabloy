import Vue from 'vue';
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
export default {
  mixins: [ebAtomClasses],
  data() {
    return {};
  },
  computed: {
    atomClasses() {
      const atomClassesAll = this.atomClassesAll;
      if (!atomClassesAll) return [];

      const atomClasses = [];
      for (const module in atomClassesAll) {
        for (const atomClassName in atomClassesAll[module]) {
          const info = atomClassesAll[module][atomClassName];
          if (info.category) {
            atomClasses.push({
              module,
              atomClassName,
              info,
            });
          }
        }
      }
      return atomClasses;
    },
  },
  methods: {
    async onPerformClick(event, item) {
      const action = {
        actionModule: 'a-base',
        actionComponent: 'action',
        name: 'selectLocale',
        targetEl: event.currentTarget,
      };
      const locale = await this.$meta.util.performAction({ ctx: this, action, item });
      // navigate
      const queries = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      if (locale) {
        queries.language = locale.value;
        queries.languageTitle = locale.title;
      }
      const url = this.$meta.util.combineQueries('/a/baseadmin/category/tree', queries);
      this.$view.navigate(url);
    },
    renderAtomClasses() {
      const children = [];
      for (const item of this.atomClasses) {
        children.push(
          <eb-list-item
            key={`${item.module}:${item.atomClassName}`}
            title={item.info.titleLocale}
            link="#"
            propsOnPerform={event => this.onPerformClick(event, item)}
          ></eb-list-item>
        );
      }
      return (
        <eb-list inline-labels no-hairlines-md>
          {children}
        </eb-list>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('Category Management')} eb-back-link="Back"></eb-navbar>
        {this.renderAtomClasses()}
      </eb-page>
    );
  },
};
