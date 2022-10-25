export default {
  meta: {
    global: true,
  },
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
    ptr: {
      type: Boolean,
      default: true,
    },
    infinite: {
      type: Boolean,
      default: true,
    },
    initOnTabShow: {
      type: Boolean,
      default: true,
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
      let listInstance = list ? list[0].componentInstance : null;
      if (listInstance && listInstance.getComponentInstance) {
        listInstance = listInstance.getComponentInstance();
      }
      return listInstance;
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
      this.$emit('tabShow', el);
      if (this.initOnTabShow && !this.inited && this.list) {
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
  render() {
    return (
      <f7-page-content
        id={this.id}
        tab={this.tab}
        tab-active={this.tabActive}
        ptr={this.ptr}
        onPtrRefresh={this.onRefresh}
        infinite={this.infinite}
        infinitePreloader={false}
        onInfinite={this.onInfinite}
        onTabShow={this.onTabShow}
      >
        {!!this.$scopedSlots.list && this.$scopedSlots.list()}
        {!!this.$scopedSlots.default && this.$scopedSlots.default()}
      </f7-page-content>
    );
  },
};
