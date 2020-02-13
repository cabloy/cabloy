<template>
  <eb-page>
    <eb-navbar :title="$text('Select Category')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="done" @click.prevent="onDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-tree ref="tree" :options="treeOptions">
      <span slot-scope="{node}" @click.stop="onNodeClick(node)">
        <f7-icon v-if="node.states._selected" material="check_box"></f7-icon>{{node.text}}
      </span>
    </eb-tree>
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
      treeOptions: {
        fetchData: node => {
          return this.fetchChildren(node);
        },
      },
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
  },
  methods: {
    fetchChildren(node) {
      // root
      if (node.id === 'root' && this.categoryIdStart === undefined) {
        return new Promise(resolve => {
          resolve([{
            id: '_root',
            text: 'Root',
            data: {
              id: 0,
              catalog: 1,
            },
            showChildren: true,
            isBatch: true,
          }]);
        });
      }
      // children
      const categoryId = node.id === 'root' ? this.categoryIdStart : node.data.id;
      return this.$api.post('category/children', {
          atomClass: this.atomClass,
          language: this.language,
          categoryId,
        })
        .then(data => {
          let list = data.list.map(item => {
            const node = {
              id: item.id,
              text: item.categoryName || '[New Category]',
              data: item,
              showChildren: item.catalog === 1,
              isBatch: item.catalog === 1,
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
        });
    },
    onDone() {
      const selected = this.getSelected();
      if (!selected) return;

      this.contextCallback(200, selected);
      this.$f7router.back();
    },
    onNodeClick(node) {
      if (this.leafOnly && node.data.catalog === 1) return;
      if (node.states._selected) {
        this.$set(node.states, '_selected', false);
      } else {
        if (this.multiple) {
          this.$set(node.states, '_selected', true);
        } else {
          this.unSelectAll();
          this.$set(node.states, '_selected', true);
        }
      }
    },
    unSelectAll() {
      const selection = this.$refs.tree.find({ state: { _selected: true } }, true);
      if (selection) {
        for (const item of selection) {
          this.$set(item.states, '_selected', false);
        }
      }
    },
    getSelected() {
      const selection = this.$refs.tree.find({ state: { _selected: true } }, this.multiple);
      if (!selection) return null;
      return this.multiple ? selection.map(node => node.data) : selection[0].data;
    },
  },
};

</script>
