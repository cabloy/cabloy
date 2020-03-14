<template>
  <div class="eb-loadmore" v-if="doing || none || nomore || retry">
    <f7-preloader class="eb-preloader" v-if="doing"></f7-preloader>
    <div v-if="none">{{$text('No data')}}</div>
    <div v-if="nomore">{{$text('No more data')}}</div>
    <div v-if="retry">
      <f7-button round class="color-orange" @click="onRetry">{{$text('Load error, try again')}}</f7-button>
    </div>
  </div>
</template>
<script>
export default {
  meta: {
    global: true,
  },
  name: 'eb-loadmore',
  props: {
    autoInit: {
      type: Boolean,
      default: false,
    },
    onLoadClear: {
      type: Function,
    },
    onLoadMore: {
      type: Function,
    },
  },
  data() {
    return {
      finished: false,
      doing: false,
      index: 0,
      error: false,
      inited: false,
    };
  },
  created() {
    // load first
    if (this.autoInit) {
      this.$nextTick(() => {
        this.reload(true);
      });
    }
  },
  computed: {
    none() {
      return !this.error && !this.doing && this.finished && this.index == 0;
    },
    nomore() {
      return !this.error && !this.doing && this.finished && this.index > 0;
    },
    retry() {
      return this.error;
    },
  },
  methods: {
    reload(force) {
      if (!force && !this.inited) return;
      this.inited = true;
      if (!this.onLoadClear) throw new Error('onLoadClear not exists.');
      this.onLoadClear(() => {
        this.finished = false;
        this.doing = false;
        this.index = 0;
        this.error = false;
        this.loadMore();
      });
    },
    loadMore() {
      if (this.finished || this.doing) return;

      this.doing = true;
      this.error = false;

      if (!this.onLoadMore) throw new Error('onLoadMore not exists.');
      this.onLoadMore({ index: this.index })
        .then(data => {
          this.error = false;
          this.doing = false;
          this.index = data.index;
          this.finished = data.finished;
        }).catch(() => {
          this.error = true;
          this.doing = false;
        });
    },
    onRetry() {
      this.loadMore();
    },
  },
};

</script>
<style>
</style>
