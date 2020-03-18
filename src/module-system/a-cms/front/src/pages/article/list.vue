<template>
  <eb-page :page-content="false">
    <eb-navbar large largeTransparent :title="title" eb-back-link="Back">
      <f7-nav-right>
        <f7-link v-if="showPopover && categoryId" iconMaterial="add" :popover-open="`#${popoverId}`"></f7-link>
        <eb-link iconMaterial="search" :onPerform="onPerformSearch"></eb-link>
        <eb-link iconMaterial="sort" :onPerform="onPerformAtomOrders"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-tab-page-content :tab="false" tab-active>
      <eb-atoms ref="all" slot="list" :mode="categoryId?'all':'tag'" :atomClass="atomClass" :where="where"></eb-atoms>
    </eb-tab-page-content>
    <f7-popover :id="popoverId">
      <f7-list v-if="showPopover" inset>
        <eb-list-button v-for="action of actions" :key="action.id" popover-close :context="action" :onPerform="onAction">{{action.titleLocale}}</eb-list-button>
      </f7-list>
    </f7-popover>
  </eb-page>
</template>
<script>
//  articles of category / tag
import Vue from 'vue';
const ebMenus = Vue.prototype.$meta.module.get('a-base').options.mixins.ebMenus;
const ebAtoms = Vue.prototype.$meta.module.get('a-base').options.components.ebAtoms;
import utils from '../../common/utils.js';
export default {
  mixins: [ebMenus],
  components: {
    ebAtoms,
  },
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
      language: this.$f7route.query.language,
      categoryId: this.$f7route.query.categoryId,
      categoryName: this.$f7route.query.categoryName,
      tagId: this.$f7route.query.tagId,
      tagName: this.$f7route.query.tagName,
      popoverId: Vue.prototype.$meta.util.nextId('popover'),
      actions: null,
    };
  },
  computed: {
    title() {
      return this.categoryId ?
        `${this.$text('Category')}: ${this.categoryName}` :
        `${this.$text('Tag')}: ${this.tagName}`;
    },
    where() {
      return this.categoryId ? { categoryId: this.categoryId } : { tagId: this.tagId };
    },
    showPopover() {
      return this.actions && this.actions.length > 0;
    },
  },
  created() {
    // functionList
    const options = {
      where: { menu: 1, sceneName: 'create' },
      orders: [
        ['sorting', 'asc'],
      ],
    };
    if (this.atomClass) {
      options.where['e.module'] = this.atomClass.module;
      options.where['e.atomClassName'] = this.atomClass.atomClassName;
    }
    this.$api.post('/a/base/function/list', {
      options,
    }).then(data => {
      this.actions = data.list;
    });
  },
  methods: {
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onAction(event, item) {
      // menu
      let _menu = this.getMenu(item);
      if (!_menu) return;
      if (_menu.action === 'create') {
        item = {
          atomClassId: item.atomClassId,
          module: item.module,
          atomClassName: item.atomClassName,
          atomClassIdParent: item.atomClassIdParent,
          language: this.language,
          categoryId: this.categoryId,
        };
        _menu = this.$utils.extend({}, _menu, { targetEl: event.target });
      }
      // add
      return this.$meta.util.performAction({ ctx: this, action: _menu, item });
    },
    onPerformSearch() {
      const url = this.combineAtomClass('/a/base/atom/search');
      this.$view.navigate(url, { target: '_self' });
    },
    onPerformAtomOrders(event) {
      this.$refs.all.openPopoverForAtomOrders(event.currentTarget);
    },
  },
};

</script>
