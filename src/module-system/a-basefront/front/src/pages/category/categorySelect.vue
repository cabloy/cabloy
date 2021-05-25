<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Select Category')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-treeview ref="tree" :root="root" :onLoadChildren="onLoadChildren">
    </eb-treeview>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    const query = this.$f7route.query;
    const atomClass = {
      module: query.module,
      atomClassName: query.atomClassName,
    };
    const language = query.language;
    return {
      atomClass,
      language,
    };
  },
  computed: {
    categoryIdStart() {
      return this.contextParams.categoryIdStart;
    },
    multiple() {
      return this.contextParams.multiple;
    },
    catalogOnly() {
      return this.contextParams.catalogOnly;
    },
    leafOnly() {
      return this.contextParams.leafOnly;
    },
    categoryIdDisable() {
      return this.contextParams.categoryIdDisable;
    },
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
    async onLoadChildren(node) {
      // root
      if (node.root && this.categoryIdStart === undefined) {
        const checkbox = !this.leafOnly;
        return [{
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
        }];
      }
      // children
      const categoryId = node.root ? this.categoryIdStart : node.id;
      const data = await this.$api.post('/a/base/category/children', {
        atomClass: this.atomClass,
        language: this.language,
        categoryId,
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
        return (!this.catalogOnly || item.data.categoryCatalog === 1) &&
          (!this.categoryIdDisable || this.categoryIdDisable !== item.id);
      });
      return list;
    },
    onPerformDone() {
      const checked = this.$refs.tree.checked();
      let res;
      if (!checked || checked.length === 0) {
        res = null;
      } else {
        res = checked;
      }
      this.contextCallback(200, res);
      this.$f7router.back();
    },
  },
};

</script>
