<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Select Category')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="done" @click.prevent="onDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-treeview ref="tree" :root="root" :onLoadChildren="onLoadChildren">
    </eb-treeview>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
import utils from '../../common/utils.js';
export default {
  mixins: [ebPageContext],
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
    };
  },
  computed: {
    categoryIdStart() {
      return this.contextParams.categoryIdStart;
    },
    multiple() {
      return this.contextParams.multiple;
    },
    language() {
      return this.contextParams.language;
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
        }
      };
    }
  },
  methods: {
    onLoadChildren(node) {
      // root
      if (node.root && this.categoryIdStart === undefined) {
        return new Promise(resolve => {
          const checkbox = !this.leafOnly;
          resolve([{
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
              catalog: 1,
            },
          }]);
        });
      }
      // children
      const categoryId = node.root ? this.categoryIdStart : node.id;
      return this.$api.post('category/children', {
          atomClass: this.atomClass,
          language: this.language,
          categoryId,
        })
        .then(data => {
          let list = data.list.map(item => {
            const checkbox = !this.leafOnly || item.catalog === 0;
            const node = {
              id: item.id,
              attrs: {
                label: item.categoryName || `[${this.$text('New Category')}]`,
                toggle: item.catalog === 1,
                loadChildren: item.catalog === 1,
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
            return (!this.catalogOnly || item.data.catalog === 1) &&
              (!this.categoryIdDisable || this.categoryIdDisable !== item.id);
          });
          return list;
        })
        .catch(err => {
          this.$view.toast.show({ text: err.message });
          throw err;
        });
    },
    onDone() {
      const checked = this.$refs.tree.checked();
      if (!checked || checked.length === 0) return;

      this.contextCallback(200, checked);
      this.$f7router.back();
    },
  },
};

</script>
