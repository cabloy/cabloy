export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layoutConfig: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  created() {
    this.layoutManager.layout.instance = this;
    this.layoutManager.subnavbar.enable = true;
  },
  methods: {
    getMainInstance() {
      return this.$refs['block:main'] && this.$refs['block:main'].getComponentInstance();
    },
    getValidateInstance() {
      const mainInstance = this.getMainInstance();
      return mainInstance && mainInstance.getValidateInstance();
    },
    getBlockComponentOptions({ blockConfig }) {
      return {
        props: {
          layoutManager: this.layoutManager,
          layout: this,
          blockConfig,
        },
      };
    },
    _renderBlock({ blockName }) {
      const blockConfig = this.layoutConfig.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component ref={`block:${blockName}`} module={blockConfig.component.module} name={blockConfig.component.name} options={this.getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
  },
  render() {
    return (
      <div>
        {this._renderBlock({ blockName: 'main' })}
      </div>
    );
  },
};

