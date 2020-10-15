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
  },
  methods: {
    getBlockComponentOptions({ blockConfig }) {
      return {
        props: {
          layoutManager: this.layoutManager,
          blockConfig,
        },
      };
    },
    _renderBlockTitle() {
      const blockConfig = this.layoutConfig.blocks.title;
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
  },
  render() {
    return (
      <div>
        {this._renderBlockTitle()}
      </div>
    );
  },
};

