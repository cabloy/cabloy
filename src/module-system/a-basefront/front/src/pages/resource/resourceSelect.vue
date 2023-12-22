<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconF7="::done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-treeview v-if="ready" ref="tree" :root="root" :onLoadChildren="onLoadChildren"> </eb-treeview>
    <f7-block></f7-block>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    const query = this.$f7route.query;
    const maxLevelAutoOpened = parseInt(query.maxLevelAutoOpened || 1);
    const resourceType = query.resourceType;
    return {
      maxLevelAutoOpened,
      resourceType,
      treeData: null,
      resourcesArrayAll: null,
    };
  },
  computed: {
    ready() {
      return this.treeData && this.resourcesArrayAll;
    },
    pageTitle() {
      const resourceTypes = this.$store.getState('a/base/resourceTypes');
      if (!resourceTypes) return null;
      return `${this.$text('Select')} ${resourceTypes[this.resourceType].titleLocale}`;
    },
    multiple() {
      return this.contextParams.multiple;
    },
    fixed() {
      return this.contextParams.fixed;
    },
    checkedAtomStaticKeys() {
      return this.contextParams.checkedAtomStaticKeys;
    },
    root() {
      return {
        attrs: {
          itemToggle: false,
          selectable: false,
          multiple: this.multiple,
          maxLevelAutoOpened: this.maxLevelAutoOpened,
        },
      };
    },
  },
  created() {
    this.__init();
  },
  methods: {
    async __init() {
      await this.$store.dispatch('a/base/getResourceTypes');
      this.resourcesArrayAll = await this.$store.dispatch('a/base/getResourcesArray', {
        resourceType: this.resourceType,
      });
      this.treeData = await this.$store.dispatch('a/base/getCategoryTreeResource', { resourceType: this.resourceType });
    },
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
    async _loadNodeCategories(node) {
      let treeChildren;
      if (node.root) {
        treeChildren = this.treeData;
      } else {
        treeChildren = node.data.children;
      }
      const list = [];
      for (const item of treeChildren) {
        const checkbox = false;
        const nodeChild = {
          id: item.id,
          attrs: {
            // link: '#',
            label: item.categoryNameLocale,
            toggle: true,
            itemToggle: true,
            loadChildren: true,
            checkbox,
            checkOnLabel: checkbox,
            selectable: checkbox,
          },
          data: item,
        };
        list.push(nodeChild);
      }
      return list;
    },
    _checkCheckedInit(item) {
      if (!this.checkedAtomStaticKeys) return false;
      return this.checkedAtomStaticKeys.findIndex(_item => _item === item.atomStaticKey) > -1;
    },
    async _loadNodeResources(node) {
      const resources = this.resourcesArrayAll.filter(item => item.atomCategoryId === node.id);
      return resources.map(item => {
        const checkbox = true;
        const checked = this._checkCheckedInit(item);
        const disabled = this.fixed === 'disabled' && JSON.parse(item.resourceConfig).fixed === true;
        // node
        const node = {
          id: item.atomId,
          attrs: {
            label: item.atomNameLocale,
            toggle: false,
            loadChildren: false,
            checkbox,
            checked,
            checkOnLabel: checkbox,
            selectable: checkbox,
            itemToggle: !checkbox,
            disabled,
          },
          data: item,
        };
        return node;
      });
    },
    async onLoadChildren(node, treeviewData) {
      if (node.root || node.data.categoryCatalog === 1) {
        return await this._loadNodeCategories(node, treeviewData);
      }
      return await this._loadNodeResources(node, treeviewData);
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
<style lang="less" scoped></style>
