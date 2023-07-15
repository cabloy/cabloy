export default {
  meta: {
    global: true,
  },
  name: 'eb-load-more',
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
      return !this.error && !this.doing && this.finished && this.index === 0;
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
      this.clear(() => {
        this.loadMore();
      });
    },
    clear(done) {
      if (!this.onLoadClear) throw new Error('onLoadClear not exists');
      this.onLoadClear(() => {
        this.finished = false;
        this.doing = false;
        this.index = 0;
        this.error = false;
        done && done();
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
        })
        .catch(err => {
          console.error(err);
          this.error = true;
          this.doing = false;
        });
    },
    onRetry() {
      this.loadMore();
    },
    renderContent() {
      const show = this.doing || this.none || this.nomore || this.retry;
      if (!show) return null;
      return (
        <div class="eb-loadmore">
          {this.doing && <f7-preloader class="eb-preloader"></f7-preloader>}
          {this.none && <div>{this.$text('No Data')}</div>}
          {this.nomore && <div>{this.$text('No More Data')}</div>}
          {this.retry && (
            <div>
              <f7-button round class="color-orange" onClick={this.onRetry}>
                {this.$text('Load Error, Try Again')}
              </f7-button>
            </div>
          )}
        </div>
      );
    },
  },
  render() {
    return this.renderContent();
  },
};
