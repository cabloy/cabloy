<script>
export default {
  render(c) {
    const children = [];
    children.push(c('f7-link', {
      props: {
        iconMaterial: 'delete',
      },
      on: {
        click: this.onClickClose,
      },
    }));
    children.push(c('f7-link', {
      props: {
        iconMaterial: 'remove',
      },
      on: {
        click: this.onClickHide,
      },
    }));
    children.push(c('f7-link', {
      props: {
        iconMaterial: this.sidebar.options.cover ? 'chevron_left' : 'expand_more',
      },
      on: {
        click: this.onClickCover,
      },
    }));
    const toolbar = c('f7-toolbar', {
      ref: 'toolbar',
      staticClass: 'panel-toolbar',
      attrs: {},
    }, children);
    return toolbar;
  },
  props: {
    side: {
      type: String,
    }
  },
  data() {
    return {}
  },
  computed: {
    layout() {
      return this.sidebar.layout;
    },
    sidebar() {
      return this.$parent.$parent;
    },
  },
  methods: {
    onClickCover() {
      this.sidebar.options.cover = !this.sidebar.options.cover;
      this.layout.onResize();
      this.layout.__saveLayoutConfig();
    },
    onClickHide() {
      this.sidebar.setOpened(!this.sidebar.options.opened);
    },
    onClickClose() {
      const view = this.sidebar._getTopView();
      if (view) {
        this.sidebar.closeView(this.$$('#' + view.id)[0].f7View);
      }
    },
  }
}

</script>
