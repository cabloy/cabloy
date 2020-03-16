<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="getPageTitle()" eb-back-link="Back"> </eb-navbar>
    <f7-list class="eb-admin-function-scene">
      <eb-list-item v-for="(item,index) of functionScenes" :key="item.id" :title="item.titleLocale" :badge="index+1" v-eb-dragdrop="getDragdropContext(item)">
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
export default {
  data() {
    return {
      menu: parseInt(this.$f7route.query.menu),
      functionScenes: null,
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    };
  },
  created() {
    this.__loadFunctionScenes();
  },
  methods: {
    getPageTitle() {
      if (this.menu === 0) return this.$text('Function Category');
      if (this.menu === 1) return this.$text('Menu Category');
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
      const [panelDrop, panelIndexDrop] = this.sidebar._getPanelAndIndex(context.panel);
      const [panelDrag, panelIndexDrag] = this.sidebar._getPanelAndIndex(dragContext.panel);
      if (panelIndexDrop === panelIndexDrag || panelIndexDrop == panelIndexDrag + 1) return null;
      // dropElement
      const dropElement = $el;
      // tooltip
      const tooltip = this.__getPanelTitle(panelDrop);
      // ok
      return { dropElement, tooltip };
    },
    onDragDone({ $el, context, dragElement, dropElement, dropContext }) {
      const panelIndexDrag = this.sidebar._getPanelIndex(context.panel);
      this.panels.splice(panelIndexDrag, 1);
      const panelIndexDrop = this.sidebar._getPanelIndex(dropContext.panel);
      this.panels.splice(panelIndexDrop, 0, context.panel);
      // save
      this.layout.__saveLayoutConfig();
    },
    __loadFunctionScenes() {
      this.$api.post('function/scenesLoad', { sceneMenu: this.menu }).then(data => {
        this.functionScenes = data;
      });
    },
  },
};

</script>
