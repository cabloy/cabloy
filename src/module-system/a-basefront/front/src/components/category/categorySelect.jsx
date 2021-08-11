export default {
  props: {
    atomClass: {},
    language: {},
    categoryIdStart: {},
    multiple: {},
    catalogOnly: {},
    leafOnly: {},
    categoryIdDisable: {},
    setLocale: {},
  },
  data() {
    return {};
  },
  computed: {
    root() {
      return {
        attrs: {
          itemToggle: false,
          selectable: false,
          multiple: this.multiple,
          checkbox: true,
          checkOnLabel: true,
        },
      };
    },
  },
  methods: {
    getInstance() {
      return this.$refs.tree;
    },
    async onLoadChildren(node) {
      // root
      if (node.root && this.categoryIdStart === undefined) {
        const checkbox = !this.leafOnly;
        return [
          {
            id: 0,
            attrs: {
              label: this.$text('Root'),
              toggle: true,
              loadChildren: true,
              checkbox,
              checkOnLabel: checkbox,
              selectable: checkbox,
              itemToggle: !checkbox,
            },
            data: {
              id: 0,
              categoryCatalog: 1,
            },
          },
        ];
      }
      // children
      const categoryId = node.root ? this.categoryIdStart : node.id;
      const data = await this.$api.post('/a/base/category/children', {
        atomClass: this.atomClass,
        language: this.language,
        categoryId,
        setLocale: this.setLocale,
      });
      let list = data.list.map(item => {
        const checkbox = !this.leafOnly || item.categoryCatalog === 0;
        const node = {
          id: item.id,
          attrs: {
            label: item.categoryNameLocale || item.categoryName || `[${this.$text('New Category')}]`,
            toggle: item.categoryCatalog === 1,
            loadChildren: item.categoryCatalog === 1,
            checkbox,
            checkOnLabel: checkbox,
            selectable: checkbox,
            itemToggle: !checkbox,
          },
          data: item,
        };
        return node;
      });
      list = list.filter(item => {
        return (!this.catalogOnly || item.data.categoryCatalog === 1) && (!this.categoryIdDisable || this.categoryIdDisable !== item.id);
      });
      return list;
    },
  },
  render() {
    return <eb-treeview ref="tree" root={this.root} propsOnLoadChildren={this.onLoadChildren}></eb-treeview>;
  },
};
