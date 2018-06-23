<template>
  <f7-page>
    <eb-navbar :title="$text('Select Roles')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="done" @click.prevent="onDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <tree ref="tree" :options="treeOptions">
      <span slot-scope="{node}" @click.prevent="onNodeClick(node)">
        <f7-icon v-if="node.states._selected" material="check_box"></f7-icon>{{node.text}}</span>
    </tree>
  </f7-page>
</template>
<script>
import Vue from 'vue';
import LiquorTree from 'liquor-tree';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ebPageContext],
  components: {
    [LiquorTree.name]: LiquorTree,
  },
  data() {
    return {
      treeOptions: {
        fetchData: node => {
          return this.fetchChildren(node.id);
        },
      },
    };
  },
  computed: {
    roleIdStart() {
      return this.contextParams.roleIdStart;
    },
    multiple() {
      return this.contextParams.multiple;
    },
    catalogOnly() {
      return this.contextParams.catalogOnly;
    },
    roleIdDisable() {
      return this.contextParams.roleIdDisable;
    },
  },
  methods: {
    fetchChildren(roleId) {
      if (roleId === 'root') roleId = this.roleIdStart;
      return this.$api.post('role/children', { roleId, page: { size: 0 } })
        .then(data => {
          let list = data.list.map(item => {
            const node = {
              id: item.id,
              text: item.roleName,
              data: item,
              showChildren: item.catalog === 1,
              isBatch: item.catalog === 1,
            }
            return node;
          });
          if (this.catalogOnly) {
            list = list.filter(item => item.data.catalog === 1 && (!this.roleIdDisable || this.roleIdDisable !== item.id));
          }
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
      this.$f7Router.back();
    },
    onNodeClick(node) {
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
    }
  },
};

</script>
