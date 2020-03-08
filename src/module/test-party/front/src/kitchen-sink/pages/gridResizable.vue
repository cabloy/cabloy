<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Grid / Layout')" eb-back-link="Back"></eb-navbar>
    <div class="grid-demo">
      <f7-block medium>
        <p>Columns within a row are automatically set to have equal width. Otherwise you can define your column with pourcentage of screen you want.</p>
      </f7-block>
      <f7-block-title>Responsive Grid (Resizable)</f7-block-title>
      <f7-block>
        <p>Grid cells have different size on Small/Medium/Large</p>
        <f7-row ref="resizableRow">
          <f7-col v-for="(col,index) of resizableCols" :key="index" resizable :width="col.small" :medium="col.medium" :large="col.large">{{col[getViewSize()]}}</f7-col>
        </f7-row>
      </f7-block>
      <f7-block-title>Columns with gap</f7-block-title>
      <f7-block>
        <f7-row>
          <f7-col>50% (.col)</f7-col>
          <f7-col>50% (.col)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col>25% (.col)</f7-col>
          <f7-col>25% (.col)</f7-col>
          <f7-col>25% (.col)</f7-col>
          <f7-col>25% (.col)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col>33% (.col)</f7-col>
          <f7-col>33% (.col)</f7-col>
          <f7-col>33% (.col)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col width="33">33% (.col-33)</f7-col>
          <f7-col width="66">66% (.col-66)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col width="25">25% (.col-25)</f7-col>
          <f7-col width="25">25% (.col-25)</f7-col>
          <f7-col width="50">50% (.col-50)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col width="75">75% (.col-75)</f7-col>
          <f7-col width="25">25% (.col-25)</f7-col>
        </f7-row>
        <f7-row>
          <f7-col width="80">80% (.col-80)</f7-col>
          <f7-col width="20">20% (.col-20)</f7-col>
        </f7-row>
      </f7-block>
      <f7-block-title>No gap between columns</f7-block-title>
      <f7-block>
        <f7-row no-gap>
          <f7-col>50% (.col)</f7-col>
          <f7-col>50% (.col)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col>25% (.col)</f7-col>
          <f7-col>25% (.col)</f7-col>
          <f7-col>25% (.col)</f7-col>
          <f7-col>25% (.col)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col>33% (.col)</f7-col>
          <f7-col>33% (.col)</f7-col>
          <f7-col>33% (.col)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
          <f7-col>20% (.col)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col width="33">33% (.col-33)</f7-col>
          <f7-col width="66">66% (.col-66)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col width="25">25% (.col-25)</f7-col>
          <f7-col width="25">25% (.col-25)</f7-col>
          <f7-col width="50">50% (.col-50)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col width="75">75% (.col-75)</f7-col>
          <f7-col width="25">25% (.col-25)</f7-col>
        </f7-row>
        <f7-row no-gap>
          <f7-col width="80">80% (.col-80)</f7-col>
          <f7-col width="20">20% (.col-20)</f7-col>
        </f7-row>
      </f7-block>
      <f7-block-title>Nested</f7-block-title>
      <f7-block>
        <f7-row>
          <f7-col>50% (.col)
            <f7-row>
              <f7-col>50% (.col)</f7-col>
              <f7-col>50% (.col)</f7-col>
            </f7-row>
          </f7-col>
          <f7-col>50% (.col)
            <f7-row>
              <f7-col width="33">33% (.col-33)</f7-col>
              <f7-col width="66">66% (.col-66)</f7-col>
            </f7-row>
          </f7-col>
        </f7-row>
      </f7-block>
      <f7-block-title>Responsive Grid</f7-block-title>
      <f7-block>
        <p>Grid cells have different size on Phone(Small)/Tablet(Medium)</p>
        <f7-row>
          <f7-col width="100" medium="50">.col-100.tablet-50</f7-col>
          <f7-col width="100" medium="50">.col-100.tablet-50</f7-col>
        </f7-row>
        <f7-row>
          <f7-col width="50" medium="25">.col-50.tablet-25</f7-col>
          <f7-col width="50" medium="25">.col-50.tablet-25</f7-col>
          <f7-col width="50" medium="25">.col-50.tablet-25</f7-col>
          <f7-col width="50" medium="25">.col-50.tablet-25</f7-col>
        </f7-row>
        <f7-row>
          <f7-col width="100" medium="40">.col-100.tablet-40</f7-col>
          <f7-col width="50" medium="60">.col-50.tablet-60</f7-col>
          <f7-col width="50" medium="66">.col-50.tablet-66</f7-col>
          <f7-col width="100" medium="33">.col-100.tablet-33</f7-col>
        </f7-row>
      </f7-block>
    </div>
  </eb-page>
</template>
<script>
const _colWidths = [5, 10, 15, 20, 25, 30, 33, 35, 40, 45, 50, 55, 60, 65, 66, 70, 75, 80, 85, 90, 95, 100];
export default {
  meta: {
    size: 'large',
  },
  data() {
    return {
      resizableCols: [
        { small: 50, medium: 25, large: 25 },
        { small: 50, medium: 25, large: 25 },
        { small: 50, medium: 25, large: 25 },
        { small: 50, medium: 25, large: 25 },
      ],
      dragdrop: null,
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    };
  },
  mounted() {
    this.dragdrop = Vue.prototype.$meta.module.get('a-components').options.utils.dragdrop;
    const $resizableRow = this.$$(this.$refs.resizableRow.$el);
    const $handlers = $resizableRow.find('.resize-handler');
    for (let index = 0; index < $handlers.length; index++) {
      this.dragdrop.bind($handlers[index], {
        scene: this.dragdropScene,
        resizable: true,
        //resizeDirection: 'row',
        colIndex: index,
        onDragStart: this.onDragStart,
        onDragContainer: this.onDragContainer,
        onDragMove: this.onDragMove,
        onDragEnd: this.onDragEnd,
      });
    }
  },
  methods: {
    getViewSize() {
      return this.$view.size;
    },
    onDragStart({ $el, context }) {},
    onDragContainer({ $el, context }) {
      const $resizableRow = this.$$(this.$refs.resizableRow.$el);
      const size = { width: $resizableRow.width() };
      const tip = this._getTip(context);
      return { size, tip };
    },
    onDragMove({ $el, context, diff }) {
      const viewSize = this.getViewSize();
      // diff
      const diffPercent = parseInt(diff.percent.x * 100);
      if (diffPercent === 0) return;
      const minus = diffPercent < 0;
      // this col
      const col = this.resizableCols[context.colIndex];
      const colWidthCurrent = col[viewSize];
      let colWidthNew = colWidthCurrent + diffPercent;
      colWidthNew = this._getPreferWidth(colWidthCurrent, colWidthNew, false, minus);
      if (!colWidthNew) return false;
      if (colWidthCurrent === colWidthNew) return false;
      col[viewSize] = colWidthNew;
      let tip = col[viewSize];
      // next col
      const colNext = this.resizableCols[context.colIndex + 1];
      if (colNext) {
        const colWidthCurrentNext = colNext[viewSize];
        let colWidthNewNext = colWidthCurrentNext - (colWidthNew - colWidthCurrent);
        colWidthNewNext = this._getPreferWidth(colWidthCurrentNext, colWidthNewNext, true, !minus);
        if (colWidthNewNext) {
          colNext[viewSize] = colWidthNewNext;
        }
        tip = `${tip}:${colNext[viewSize]}`;
      }
      return { tip };
    },
    onDragEnd({ $el, context }) {},
    _getTip(context) {
      const viewSize = this.getViewSize();
      let tip;
      const col = this.resizableCols[context.colIndex];
      tip = col[viewSize];
      const colNext = this.resizableCols[context.colIndex + 1];
      if (colNext) {
        tip = `${tip}:${colNext[viewSize]}`;
      }
      return tip;
    },
    _getPreferWidth(widthCurrent, widthNew, force, minus) {
      const loop = force ? 5 : 2;
      for (let i = 0; i < loop; i++) {
        for (const item of _colWidths) {
          if (minus && item < widthCurrent && widthNew - item <= i) return item;
          if (!minus && item > widthCurrent && item - widthNew <= i) return item;
        }
      }
      return null;
    }

  },
};

</script>
