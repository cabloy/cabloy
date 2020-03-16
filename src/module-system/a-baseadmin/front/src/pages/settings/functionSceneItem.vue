<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="getPageTitle()" eb-back-link="Back"> </eb-navbar>
    <f7-list class="eb-admin-function-scene-item">
      <eb-list-item v-for="(item,index) of functionItems" :key="item.id" :title="item.titleLocale" :badge="index+1" v-eb-dragdrop="getDragdropContext(item)">
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
export default {
  data() {
    return {
      sceneMenu: parseInt(this.$f7route.query.sceneMenu),
      sceneId: parseInt(this.$f7route.query.sceneId),
      functionItems: null,
      functionScenes: null,
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    };
  },
  created() {
    this.$store.dispatch('a/base/getFunctionScenes', { sceneMenu: this.sceneMenu }).then(data => {
      this.functionScenes = data;
    });
    this.__functionSceneItemsLoad();
  },
  methods: {
    getPageTitle() {
      let title;
      if (this.sceneMenu === 0) title = this.$text('Function Management');
      if (this.sceneMenu === 1) title = this.$text('Menu Management');
      if (!this.functionScenes) return title;
      return `${title}: ${this.functionScenes[this.sceneId].titleLocale}`;
    },
    getDragdropContext(item) {
      return {
        scene: this.dragdropScene,
        item,
        onDragStart: this.onDragStart,
        onDropElement: this.onDropElement,
        onDragDone: this.onDragDone,
      }
    },
    onDragStart({ $el, context, dragElement }) {
      const tooltip = context.item.titleLocale;
      return { tooltip };
    },
    onDropElement({ $el, context, dragElement, dragContext }) {
      const indexDrop = this.__getSceneIndex(context.item);
      const indexDrag = this.__getSceneIndex(dragContext.item);
      if (indexDrop === indexDrag || indexDrop == indexDrag + 1) return null;
      // dropElement
      const dropElement = $el;
      // tooltip
      const tooltip = context.item.titleLocale;
      // ok
      return { dropElement, tooltip };
    },
    onDragDone({ $el, context, dragElement, dropElement, dropContext }) {
      const indexDrag = this.__getSceneIndex(context.item);
      this.functionItems.splice(indexDrag, 1);
      const indexDrop = this.__getSceneIndex(dropContext.item);
      this.functionItems.splice(indexDrop, 0, context.item);
      // save
      this.__functionSceneItemsSaveSortings();
    },
    __getSceneIndex(item) {
      return this.functionItems.findIndex(_item => _item.id === item.id);
    },
    __functionSceneItemsLoad() {
      this.$api.post('function/sceneItemsLoad', { sceneMenu: this.sceneMenu, sceneId: this.sceneId }).then(data => {
        this.functionItems = data;
      });
    },
    __functionSceneItemsSaveSortings() {
      const sortings = this.functionItems.map((item, index) => {
        return { id: item.id, sorting: index + 1 }
      });
      this.$api.post('function/sceneItemsSaveSortings', { sceneMenu: this.sceneMenu, sceneId: this.sceneId, sortings }).then(() => {
        this.$view.toast.show();
      });
    }
  },
};

</script>
