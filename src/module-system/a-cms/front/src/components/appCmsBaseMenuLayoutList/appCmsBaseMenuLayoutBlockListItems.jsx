// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebAppMenuLayoutBlockListItemsBase =
    Vue.prototype.$meta.module.get('a-app').options.mixins.ebAppMenuLayoutBlockListItemsBase;
  return {
    mixins: [ebAppMenuLayoutBlockListItemsBase],
    data() {
      return {};
    },
    computed: {
      groups2() {
        const groups = this.groups || [];
        // categoryName: general
        let groupGeneral = groups.find(item => item.categoryName === 'General');
        if (groupGeneral) {
          // todo: add divider
          // groupGeneral.items.push(null);
        } else {
          groupGeneral = {
            id: -1,
            categoryName: 'General',
            categoryNameLocale: this.$text('General'),
            categorySorting: 0,
            items: [],
          };
        }
        // todo: recent/hot/comments
        // categories
        groups.push({
          id: -2,
          categoryName: 'Categories',
          categoryNameLocale: this.$text('Categories'),
          categorySorting: 0,
        });
        // tags
        groups.push({
          id: -3,
          categoryName: 'Tags',
          categoryNameLocale: this.$text('Tags'),
          categorySorting: 0,
        });
        // ok
        return groups;
      },
    },
    methods: {
      async onInit() {},
      onGetGroups() {
        console.log(this.groups2);
        return this.groups2;
      },
      onNodeSelect(node) {
        console.log(node);
      },
      onRenderGroup(group) {
        if (group.categoryName === 'Categories') {
          return this._renderCategoryTree();
        } else if (group.categoryName === 'Tags') {
          return this._renderTags();
        }
        return this._renderGroup(group);
      },
      _renderCategoryTree() {
        const options = {
          props: {
            atomClass: {
              module: 'a-cms',
              atomClassName: 'article',
            },
            language: this.layoutManager.base_appLanguageCurrent,
            categoryIdStart: 0,
            multiple: false,
            catalogOnly: false,
            leafOnly: true,
            checkbox: false,
            categoryHidden: 0,
          },
          on: {
            nodeSelect: this.onNodeSelect,
          },
        };
        return (
          <eb-component
            ref="categorySelect"
            module="a-basefront"
            name="categorySelect"
            options={options}
          ></eb-component>
        );
      },
      _renderTags() {
        const options = {
          props: {
            atomClass: {
              module: 'a-cms',
              atomClassName: 'article',
            },
            language: this.layoutManager.base_appLanguageCurrent,
            multiple: false,
          },
          on: {
            change: this.onChange,
          },
        };
        return <eb-component ref="tagSelect" module="a-basefront" name="tagSelect" options={options}></eb-component>;
      },
    },
  };
}
