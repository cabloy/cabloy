<template>
  <f7-page-content :id="id" :tab="tab" :tab-active="tabActive" ptr ptrMousewheel @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite" @tab:show="onTabShow">
    <slot ref="list" name="list"></slot>
  </f7-page-content>
</template>
<script>
export default {
  name: 'eb-tab-page-content',
  props: {
    tab: {
      type: Boolean,
      default: true,
    },
    tabActive: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      inited: false,
      tabMounted: false,
    };
  },
  computed: {
    list() {
      const list = this.$slots.list;
      return list ? list[0].componentInstance : null;
    },
  },
  methods: {
    onRefresh(done) {
      done();
      this.list && this.list.reload();
    },
    onInfinite() {
      this.list && this.list.loadMore();
    },
    onTabShow(el) {
      this.$emit('tab:show', el);
      if (!this.inited && this.list) {
        this.inited = true;
        this.list.reload(true);
      }
    },
    getPage() {
      return this.$page.$children[0];
    },
  },
  beforeDestroy() {
    if (this.tabMounted) {
      this.$f7router.emit('tabBeforeRemove', this.$el);
    }
  },
  mounted() {
    const page = this.getPage();
    if (page.$el.f7PageInitialized) {
      // should trigger tabMounted
      this.$f7router.emit('tabMounted', this.$el);
      this.tabMounted = true;
    }
    //
    if (this.tabActive) {
      this.onTabShow();
    }
  },
};

</script>
