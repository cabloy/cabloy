import ebAtomClasses from '../../common/atomClasses.js';
export default {
  meta: {
    global: false,
  },
  mixins: [ ebAtomClasses ],
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
    this.getLayoutConfig().then(res => {
      this.layoutConfig = res;
      this.ready = true;
    });
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
    getPageTitle() {
      const atomClass = this.getAtomClass(this.atomClass);
      if (!atomClass) return this.$text('Atom');
      return `${this.$text('Atom')}: ${atomClass.titleLocale}`;
    },
    getLayoutComponentOptions() {
      return {
        props: {
          layoutManager: this,
          layoutConfig: this.layoutConfig,
        },
      };
    },
    _renderLayoutComponent() {
      if (!this.ready) return null;
      return <eb-component module={this.layoutConfig.component.module} name={this.layoutConfig.component.name} options={this.getLayoutComponentOptions()}></eb-component>;
    },
  },
  render() {
    return (
      <div>
        {this._renderLayoutComponent()}
      </div>
    );
  },
};
