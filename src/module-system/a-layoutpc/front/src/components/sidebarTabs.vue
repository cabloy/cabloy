<script>
export default {
  render(c) {
    const tabs = [];
    for (const panel of this.panels) {
      tabs.push(c('f7-link', {
        key: panel.fullName || panel.name,
        staticClass: panel.name === this.sidebar.options.panelActive ? 'active' : '',
        props: {
          text: panel.titleLocale || this.$text(panel.title) || panel.name,
        },
        nativeOn: {
          click: event => {
            this.onClickTab(event, panel);
          },
        },
      }));
    }
    return c('div', { staticClass: 'eb-layout-sidebar-tabs' }, tabs);
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
      return this.$parent;
    },
    panels() {
      return this.sidebar.options.panels;
    },
  },
  methods: {
    onClickTab(event, panel) {
      event.stopPropagation();
      event.preventDefault();

      const sceneOptions = this.$utils.extend({ side: 'left' }, panel);
      this.layout.navigate(panel.url, { scene: 'panel', sceneOptions });

      this.sidebar.options.panelActive = panel.fullName || panel.name;
    }
  }
}

</script>
