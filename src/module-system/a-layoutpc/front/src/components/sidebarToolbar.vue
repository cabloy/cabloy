<script>
export default {
  render(c) {
    const children = [];
    children.push(c('f7-link', {
      props: {
        iconMaterial: 'save',
      }
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
    onClickTab(event, panel) {
      event.stopPropagation();
      event.preventDefault();
      this.sidebar.createView({ ctx: null, panel });
    }
  }
}

</script>
