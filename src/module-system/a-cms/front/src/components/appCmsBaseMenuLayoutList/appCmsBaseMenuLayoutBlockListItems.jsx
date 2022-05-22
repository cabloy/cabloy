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
      atomClass() {
        const appItem = this.layoutManager.base.appInfoCurrent.appItem;
        return appItem.content.info.atomClass;
      },
      language() {
        return this.layoutManager.base_appLanguageCurrent;
      },
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
        return this.groups2;
      },
      onNodeSelect(node) {
        const options = {
          language: this.language,
          category: node.id,
        };
        this._openURL({ options });
      },
      onTagChange() {
        const tagSelect = this.$refs.tagSelect.getComponentInstance();
        const checked = tagSelect.checked();
        if (!checked) return;
        // options
        const options = {
          language: this.language,
          tag: checked,
        };
        this._openURL({ options });
      },
      _openURL({ options }) {
        const queries = {
          module: this.atomClass.module,
          atomClassName: this.atomClass.atomClassName,
          options: JSON.stringify(options),
        };
        const url = this.$meta.util.combineQueries('/a/basefront/atom/list', queries);
        this.$view.navigate(url);
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
            atomClass: this.atomClass,
            language: this.language,
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
            atomClass: this.atomClass,
            language: this.language,
            multiple: false,
          },
          on: {
            change: this.onTagChange,
          },
        };
        return <eb-component ref="tagSelect" module="a-basefront" name="tagSelect" options={options}></eb-component>;
      },
    },
  };
}
