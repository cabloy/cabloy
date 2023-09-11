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
      componentInstance: null, // for eb-component
    };
  },
  methods: {
    onRefresh(done) {
      done();
      const listInstance = this._getListInstance();
      listInstance && listInstance.reload();
    },
    onInfinite() {
      const listInstance = this._getListInstance();
      listInstance && listInstance.loadMore();
    },
    onTabShow(el) {
      this.$emit('tab:show', el);
      this.$emit('tabShow', el);
      this._checkInit();
    },
    getPage() {
      return this.$pageContainer.$children[0];
    },
    _getListInstance() {
      if (this.componentInstance) return this.componentInstance;
      const list = this.$slots.list;
      const listInstance = list ? list[0].componentInstance : null;
      if (!listInstance || !listInstance.getComponentInstance) return listInstance;
      // eb-component
      const listInstance2 = listInstance.getComponentInstance();
      if (listInstance2) {
        this.componentInstance = listInstance2;
        return listInstance2;
      }
      listInstance.$once('componentReady', componentInstance => {
        this.componentInstance = componentInstance;
        this._checkInit();
      });
      return null;
    },
    _checkInit() {
      const listInstance = this._getListInstance();
      if (this.initOnTabShow && !this.inited && listInstance) {
        this.inited = true;
        listInstance.reload(true);
      }
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
