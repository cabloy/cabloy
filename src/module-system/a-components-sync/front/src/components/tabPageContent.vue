<template>
  <f7-page-content :id="id" :tab="tab" :tab-active="tabActive" ptr @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite" @tab:show="onTabShow">
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
    };
  },
  computed: {
    list() {
      return this.$slots.list[0].componentInstance;
    },
  },
  methods: {
    onRefresh(event, done) { // eslint-disable-line
      done();
      this.list.reload();
    },
    onInfinite() {
      this.list.loadMore();
    },
    onTabShow(event) {
      this.$emit('tab:show', event);
      if (!this.inited) {
        this.inited = true;
        this.list.reload(true);
      }
    },
  },
  mounted() {
    if (this.tabActive) {
      this.onTabShow();
    }
  },
};

</script>
