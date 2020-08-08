<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Layout(Adaptive)')" eb-back-link="Back"></eb-navbar>
    <f7-block-title>
      <span>{{$text('Current View Size')}}</span>:&nbsp;<span>{{currentViewSize}}</span>
    </f7-block-title>
    <f7-block>
      <template v-if="currentViewSize==='small'">some content for small page</template>
      <template v-if="currentViewSize==='medium'">some content for medium page</template>
      <template v-if="currentViewSize==='large'">some content for large page</template>
    </f7-block>
    <f7-block-title>Control content's style by class name</f7-block-title>
    <f7-block>
      <div class="adaptive-demo"><span>adaptive content's style</span>&nbsp;-&nbsp;<span>{{currentViewSize}}</span></div>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      currentViewSize: null,
      _unwatch: null,
    };
  },
  mounted() {
    this._unwatch = this.$view.$watch('size', () => {
      this.onSize();
    });
    this.onSize();
  },
  beforeDestroy() {
    if (this._unwatch) {
      this._unwatch();
      this._unwatch = null;
    }
  },
  methods: {
    onSize() {
      this.currentViewSize = this.$view.size;
    },
  },
};

</script>
<style lang="less" scoped>
.eb-view-size-small {
  .adaptive-demo {
    font-size: x-small;
  }
}

.eb-view-size-small.eb-view-size-medium {
  .adaptive-demo {
    font-size: medium;
  }
}

.eb-view-size-small.eb-view-size-medium.eb-view-size-large {
  .adaptive-demo {
    font-size: x-large;
  }
}

</style>
