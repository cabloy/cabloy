<script>
export default {
  meta: {
    global: false,
  },
  props: {
    // default/select/search
    scene: {
      type: String,
    },
    // mode: default/full/search/tag
    mode: {
      type: String,
    },
    layout: {
      type: String,
    },
    atomClass: {
      type: Object,
    },
    where: {
      type: Object,
    },
    params: {
      type: Object,
    },
  },
  data() {
    return {
      ready: false,
      layout2: null,
      layoutConfig: null,
    };
  },
  created() {
    this.layout2 = this.layout || this.getLayout();
    this.layoutConfig = this.getLayoutConfig();
    this.ready = true;
  },
  methods: {
    getLayout() {
      return this.$view.size === 'small' ? 'list' : 'table';
    },
    getLayoutConfig() {
      let layoutConfig = this.$config.atom.list.layout[this.layout2];
      if (!this.atomClass) return layoutConfig;
      const configAtom = this.$meta.config.modules[this.atomClass.module];
      const layoutConfigAtom = configAtom && configAtom.atom && configAtom.atom.list && configAtom.atom.list.layout && configAtom.atom.list.layout[this.layout2];
      if (layoutConfigAtom) {
        layoutConfig = this.$meta.util.extend({}, layoutConfig, layoutConfigAtom);
      }
      return layoutConfig;
    },
  },
  render(c) {
    const children = [];
    if (this.ready) {
      children.push(c('eb-component', {
        props: {
          module: this.layoutConfig.component.module,
          name: this.layoutConfig.component.name,
          options: {
            props: {
              layoutManager: this,
              layoutConfig: this.layoutConfig,
            },
          },
        },
      }));
    }
    return c('div', children);
  },
};

</script>
