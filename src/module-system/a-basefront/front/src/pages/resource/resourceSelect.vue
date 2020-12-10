<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-treeview v-if="ready" ref="tree" :root="root" :onLoadChildren="onLoadChildren">
    </eb-treeview>
    <f7-block></f7-block>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    const query = this.$f7route.query;
    const maxLevelAutoOpened = parseInt(query.maxLevelAutoOpened || 1);
    const resourceType = query.resourceType;
    return {
      maxLevelAutoOpened,
      resourceType,
      treeData: null,
    };
  },
  computed: {
    ready() {
      return this.treeData;
    },
    pageTitle() {
      const resourceTypes = this.$store.getState('a/base/resourceTypes');
      if (!resourceTypes) return null;
      return `${this.$text('Select')} ${resourceTypes[this.resourceType].titleLocale}`;
    },
    multiple() {
      return this.contextParams.multiple;
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
        },
      };
    },
  },
  created() {
    this.__init();
  },
  methods: {
    async __init() {
      this.$store.dispatch('a/base/getResourceTypes');
      this.treeData = await this.$store.dispatch('a/base/getResourceTrees', { resourceType: this.resourceType });
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
      const levelCurrent = (node.data && node.data.__level) || 0;
      const level = levelCurrent + 1;
      let treeChildren;
      if (node.root) {
        treeChildren = this.treeData;
      } else {
        treeChildren = node.data.children;
      }
      const list = [];
      for (const item of treeChildren) {
        const checkbox = false;
        const node = {
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
          data: {
            ...item,
            __level: level,
          },
        };
        if (level <= this.maxLevelAutoOpened || this.maxLevelAutoOpened === -1) {
          const children = await this.onLoadChildren(node);
          this.$refs.tree.childrenLoaded(node, children);
          node.attrs.loadChildren = false;
          node.attrs.opened = true;
        }
        list.push(node);
      }
      return list;
    },
    _checkCheckedInit(item) {
      if (!this.checkedAtomStaticKeys) return false;
      return this.checkedAtomStaticKeys.findIndex(_item => _item === item.atomStaticKey) > -1;
    },
    async _loadNodeResources(node) {
      const options = {
        resourceType: this.resourceType,
        category: node.id,
      };
      const res = await this.$api.post('/a/base/resource/select', { options });
      return res.list.map(item => {
        // checkbox
        const checkbox = true;
        // checked
        const checked = this._checkCheckedInit(item);
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
          },
          data: item,
        };
        return node;
      });
    },
    async onLoadChildren(node) {
      if (node.root || node.data.categoryCatalog === 1) {
        return await this._loadNodeCategories(node);
      }
      return await this._loadNodeResources(node);
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
<style lang="less" scoped>

</style>
