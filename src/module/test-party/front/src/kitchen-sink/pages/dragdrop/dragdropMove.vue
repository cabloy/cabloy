<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Dragdrop(Move)')" eb-back-link="Back"> </eb-navbar>
    <f7-list class="test-dragdrop-move-list">
      <eb-list-item v-for="(item,index) of items" :key="item" :title="item" :badge="getBadge(item,index)" v-eb-dragdrop="getDragdropContext(item)">
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      items: ['🍎 Apple', '🍌 Banana', '🍒 Cherry', '🍊 Orange', '🍐 Pear'],
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
      indexDragIndex: -1,
      indexDropIndex: -1,
    };
  },
  methods: {
    getBadge(item, index) {
      if (this.indexDragIndex === index) return '🏃';
      if (this.indexDropIndex === index) return '🧍';
      return index + 1;
    },
    getDragdropContext(item) {
      return {
        scene: this.dragdropScene,
        item,
        onDragElement: this.onDragElement,
        onDragStart: this.onDragStart,
        onDropElement: this.onDropElement,
        onDropLeave: this.onDropLeave,
        onDropEnter: this.onDropEnter,
        onDragDone: this.onDragDone,
        onDragEnd: this.onDragEnd,
      }
    },
    onDragElement({ $el, context }) {
      // do nothing
    },
    onDragStart({ $el, context, dragElement }) {
      const indexDrag = this.__getItemIndex(context.item);
      this.indexDragIndex = indexDrag;
      const tooltip = context.item;
      return { tooltip };
    },
    onDropElement({ $el, context, dragElement, dragContext }) {
      const indexDrop = this.__getItemIndex(context.item);
      const indexDrag = this.__getItemIndex(dragContext.item);
      if (indexDrop === indexDrag || indexDrop == indexDrag + 1) return null;
      // dropElement
      const dropElement = $el;
      // tooltip
      const tooltip = context.item;
      // ok
      return { dropElement, tooltip };
    },
    onDropLeave({ $el, context, dropElement }) {
      this.indexDropIndex = -1;
    },
    onDropEnter({ $el, context, dropElement }) {
      const indexDrop = this.__getItemIndex(context.item);
      this.indexDropIndex = indexDrop;
    },
    onDragDone({ $el, context, dragElement, dropElement, dropContext }) {
      const indexDrag = this.__getItemIndex(context.item);
      this.items.splice(indexDrag, 1);
      const indexDrop = this.__getItemIndex(dropContext.item);
      this.items.splice(indexDrop, 0, context.item);
    },
    onDragEnd({ $el, context, dragElement }) {
      this.indexDragIndex = -1;
    },
    __getItemIndex(item) {
      return this.items.findIndex(_item => _item === item);
    },
  },
}

</script>
<style lang="less" scoped>
.test-dragdrop-move-list {
  li {
    &[data-dragdrop-drop] {
      background: rgba(128, 128, 128, 0.5);
    }
  }
}

</style>
