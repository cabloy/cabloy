import Vue from 'vue';
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
export default {
  mixins: [ ebAtomClasses ],
  data() {
    return {
    };
  },
  computed: {
    atomClasses() {
      const atomClassesAll = this.atomClassesAll;
      if (!atomClassesAll) return [];

      const atomClasses = [];
      for (const module in atomClassesAll) {
        for (const atomClassName in atomClassesAll[module]) {
          const info = atomClassesAll[module][atomClassName];
          if (info.language) {
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
    renderAtomClasses() {
      const children = [];
      for (const item of this.atomClasses) {
        children.push(
          <f7-list-item key={`${item.module}:${item.atomClassName}`} title={item.info.titleLocale}>
          </f7-list-item>
        );
      }
      return (
        <eb-list inline-labels no-hairlines-md >
          {children}
        </eb-list>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('Category Management')} eb-back-link="Back">
        </eb-navbar>
        {this.renderAtomClasses()}
      </eb-page>
    );
  },
};
