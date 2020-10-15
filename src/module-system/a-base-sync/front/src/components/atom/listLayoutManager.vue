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
  async created() {
    this.layout2 = this.layout || this.getLayout();
    this.layoutConfig = await this.getLayoutConfig();
    this.ready = true;
  },
  methods: {
    getLayout() {
      return this.$view.size === 'small' ? 'list' : 'table';
    },
    async getLayoutConfig() {
      const layoutConfig = this.$config.atom.render.list.layout[this.layout2];
      let layoutConfigAtom;
      if (this.atomClass) {
        // load module
        await this.$meta.module.use(this.atomClass.module);
        // config
        const configAtom = this.$meta.config.modules[this.atomClass.module];
        layoutConfigAtom = configAtom && configAtom.atoms && configAtom.atoms[this.atomClass.atomClassName];
        layoutConfigAtom = layoutConfigAtom && layoutConfigAtom.render && layoutConfigAtom.render.list && layoutConfigAtom.render.list.layout;
        layoutConfigAtom = layoutConfigAtom && layoutConfigAtom[this.layout2];
      }
      return this.$meta.util.extend({}, layoutConfig, layoutConfigAtom);
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
