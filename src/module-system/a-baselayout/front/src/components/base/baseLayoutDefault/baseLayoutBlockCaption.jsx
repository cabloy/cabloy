export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  mounted() {
    this._unwatchPageTitle = this.$watch(
      'layoutManager.page_title',
      () => {
        this._changePageTitle();
      },
      {
        immediate: true,
      }
    );
  },
  beforeDestroy() {
    if (this._unwatchPageTitle) {
      this._unwatchPageTitle();
      this._unwatchPageTitle = null;
    }
  },
  methods: {
    _changePageTitle() {
      const title = this.layoutManager.page_title;
      this.$page.setPageTitle(title);
    },
  },
  render() {
    return (
      <f7-nav-title>
        <div>{this.layoutManager.page_title}</div>
        <div class="subtitle">{this.layoutManager.page_getSubtitle()}</div>
      </f7-nav-title>
    );
  },
};
