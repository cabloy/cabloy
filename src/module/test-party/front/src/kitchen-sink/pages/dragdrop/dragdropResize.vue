<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Dragdrop(Resize)')" eb-back-link="Back"> </eb-navbar>
    <div class="test-dragdrop-resize-element" :style="{width:width+'px',height:height+'px'}">
      <span class="resize-handler-col" v-eb-dragdrop="getDragdropContext('col')"></span>
      <span class="resize-handler-row" v-eb-dragdrop="getDragdropContext('row')"></span>
    </div>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      width: 150,
      height: 150,
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    };
  },
  methods: {
    getDragdropContext(resizeDirection) {
      return {
        scene: this.dragdropScene,
        resizable: true,
        resizeDirection,
        onDragStart: this.onDragStart,
        onDragMove: this.onDragMove,
        onDragEnd: this.onDragEnd,
      };
    },
    onDragStart({ $el, context }) {
      const isRow = context.resizeDirection === 'row';
      const size = this.$view.sizeExtent;
      const tooltip = isRow ? this.height : this.width;
      return { size, tooltip };
    },
    onDragMove({ $el, context, diff }) {
      const isRow = context.resizeDirection === 'row';
      if (!isRow) {
        let diffAbs = parseInt(diff.abs.x);
        if (diffAbs === 0) return;
        this.width += diffAbs;
        const tooltip = this.width;
        return { eaten: true, tooltip };
      } else {
        let diffAbs = parseInt(diff.abs.y);
        if (diffAbs === 0) return;
        this.height += diffAbs;
        const tooltip = this.height;
        return { eaten: true, tooltip };
      }
    },
    onDragEnd({ $el, context }) {
      // do nothing
    },
  },
}

</script>
<style lang="less" scoped>
.test-dragdrop-resize-element {
  position: relative;
  margin: 20px;
  background: gray;

  .resize-handler-col {
    right: 0;
    width: var(--f7-grid-gap);
    left: 100%;
    top: 0;
    height: 100%;
    cursor: col-resize;
    position: absolute;
    user-select: none;

    &:after {
      content: '';
      position: absolute;
      border-radius: 4px;
      background: var(--f7-grid-resize-handler-bg-color);
      width: 4px;
      margin-left: -2px;
      height: 80%;
      max-height: 20px;
      border-radius: 4px;
      left: 50%;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .resize-handler-row {
    bottom: 0;
    height: var(--f7-grid-gap);
    top: 100%;
    left: 0;
    width: 100%;
    cursor: row-resize;
    position: absolute;
    user-select: none;

    &:after {
      content: '';
      position: absolute;
      border-radius: 4px;
      background: var(--f7-grid-resize-handler-bg-color);
      height: 4px;
      margin-top: -2px;
      width: 80%;
      max-width: 20px;
      border-radius: 4px;
      left: 50%;
      top: 50%;
      transform: translateX(-50%);
    }
  }
}

</style>
