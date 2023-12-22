export default {
  data() {
    const query = this.$f7route.query;
    const atomClass = {
      module: query.module,
      atomClassName: query.atomClassName,
    };
    const language = query.language;
    const languageTitle = query.languageTitle;
    return {
      atomClass,
      language,
      languageTitle,
    };
  },
  computed: {
    pageTitle() {
      const title = this.$text('Categories');
      if (!this.language) return title;
      return `${title}: ${this.languageTitle}`;
    },
    maxLevelAutoOpened() {
      return this.$meta.config.modules['a-baseadmin'].category.select.maxLevelAutoOpened;
    },
    root() {
      return {
        attrs: {
          itemToggle: false,
          selectable: true,
          maxLevelAutoOpened: this.maxLevelAutoOpened,
        },
      };
    },
  },
  mounted() {
    this.$meta.eventHub.$on('category:save', this.onCategorySave);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('category:save', this.onCategorySave);
  },
  methods: {
    combineAtomClassAndLanguage() {
      const queries = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
      };
      if (this.language) {
        queries.language = this.language;
      }
      return queries;
    },
    async onLoadChildren(node) {
      // root
      if (node.root) {
        const nodeAll = {
          id: 0,
          attrs: {
            link: '#',
            label: this.$text('All'),
            toggle: true,
            loadChildren: true,
          },
          data: {
            id: 0,
            categoryCatalog: 1,
          },
        };
        return [nodeAll];
      }
      // children
      const data = await this.$api.post('/a/base/category/children', {
        atomClass: this.atomClass,
        language: this.language,
        categoryId: node.id,
      });
      const list = [];
      for (const item of data.list) {
        const nodeChild = {
          id: item.id,
          attrs: {
            link: '#',
            label: item.categoryNameLocale || item.categoryName || `[${this.$text('New Category')}]`,
            toggle: item.categoryCatalog === 1,
            loadChildren: item.categoryCatalog === 1,
          },
          data: item,
        };
        list.push(nodeChild);
      }
      return list;
    },
    onNodePerformClick(event, context, node) {
      if (!node.id) return;
      const queries = this.combineAtomClassAndLanguage();
      queries.categoryId = node.id;
      const url = this.$meta.util.combineQueries('/a/baseadmin/category/edit', queries);
      this.$view.navigate(url);
    },
    async onPerformAdd(event, node) {
      const categoryId = node.data.id;
      const categoryName = await this.$view.dialog.prompt(this.$text('Please specify the category name'));
      if (!categoryName) return;
      await this.$api.post('/a/base/category/add', {
        atomClass: this.atomClass,
        data: {
          categoryName,
          language: this.language,
          categoryIdParent: categoryId,
        },
      });
      this._clearSystemCache();
      this.reloadNode(node, {
        attrs: {
          toggle: true,
          loadChildren: true,
        },
      });
    },
    async onPerformDelete(event, node) {
      await this.$view.dialog.confirm();
      await this.$api.post('/a/base/category/delete', {
        categoryId: node.data.id,
      });
      this._clearSystemCache();
      this.reloadNode(node.parent);
    },
    onPerformMove(event, node) {
      const categoryId = node.data.id;
      const categoryIdParentOld = node.data.categoryIdParent;
      const url = this.$meta.util.combineQueries('/a/basefront/category/select', this.combineAtomClassAndLanguage());
      this.$view.navigate(url, {
        context: {
          params: {
            disabledCategoryIds: [categoryId, categoryIdParentOld],
          },
          callback: (code, data) => {
            if (code === 200) {
              if (!data) return;
              const categoryIdParent = data.id;
              this._moveNode(node, categoryIdParent);
            }
          },
        },
      });
    },
    async _moveNode(node, categoryIdParent) {
      if (node.data.categoryIdParent === categoryIdParent) return;
      const categoryId = node.data.id;
      await this.$api.post('/a/base/category/move', { categoryId, categoryIdParent });
      this._clearSystemCache();
      this.reloadNode(this.findNode(node.data.categoryIdParent));
      this.reloadNode(this.findNode(categoryIdParent), {
        attrs: {
          toggle: true,
          loadChildren: true,
        },
      });
    },
    reloadNode(node, nodeNew) {
      if (!node) return;
      this.$refs.tree.reloadNode(node, nodeNew);
    },
    findNode(id) {
      return this.$refs.tree.find(null, node => node.id === id);
    },
    onCategorySave(data) {
      if (
        data.atomClass.module !== this.atomClass.module ||
        data.atomClass.atomClassName !== this.atomClass.atomClassName
      ) {
        return;
      }
      this._clearSystemCache();
      const node = this.findNode(data.categoryIdParent);
      this.reloadNode(node);
    },
    _clearSystemCache() {
      this.$store.commit('a/base/setCategoryTree', {
        atomClass: this.atomClass,
        language: this.language,
        tree: null,
      });
      this.$store.commit('a/base/setCategories', {
        atomClass: this.atomClass,
        language: this.language,
        categories: null,
      });
    },
    async onNodePerformPopover(event, node) {
      const refTree = this.$refs.tree;
      refTree._openNodeContextMenu(node);
    },
    _renderListItemContextMenu(node) {
      const domActions = [];
      domActions.push(
        <div key="add" propsOnPerform={event => this.onPerformAdd(event, node)}>
          <f7-icon slot="media" f7=":outline:add-circle-outline"></f7-icon>
          <div slot="title">{this.$text('Add')}</div>
        </div>
      );
      if (node.id > 0) {
        domActions.push(
          <div key="move" propsOnPerform={event => this.onPerformMove(event, node)}>
            <f7-icon slot="media" f7=":outline:folder-transfer-outline"></f7-icon>
            <div slot="title">{this.$text('Move')}</div>
          </div>
        );
        domActions.push(
          <div key="delete" propsOnPerform={event => this.onPerformDelete(event, node)}>
            <f7-icon slot="media" f7="::delete"></f7-icon>
            <div slot="title">{this.$text('Delete')}</div>
          </div>
        );
      }
      const domRight = <div slot="right">{domActions}</div>;
      return <eb-context-menu mode="menu">{domRight}</eb-context-menu>;
    },
    _renderNodeAfter(node) {
      const domPopover = (
        <eb-link
          iconF7="::more-horiz"
          iconColor="gray"
          propsOnPerform={event => this.onNodePerformPopover(event, node)}
        ></eb-link>
      );
      const domContextMenu = this._renderListItemContextMenu(node);
      return (
        <div class="treeview-item-root-end" slot="root-end" slot-scope="{ node }">
          {domPopover}
          {domContextMenu}
        </div>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.pageTitle} eb-back-link="Back"></eb-navbar>
        <eb-treeview
          ref="tree"
          root={this.root}
          propsOnLoadChildren={this.onLoadChildren}
          propsOnNodePerform={this.onNodePerformClick}
          {...{
            scopedSlots: {
              'root-end': ({ node }) => {
                return this._renderNodeAfter(node);
              },
            },
          }}
        ></eb-treeview>
      </eb-page>
    );
  },
};
