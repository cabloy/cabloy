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
  created() {},
  methods: {
    onClickStage() {
      this.layoutManager.filter_openTab('general');
    },
    _renderStage() {
      // stage
      let stage = this.layoutManager.base_getCurrentStage();
      if (!stage) stage = 'formal';
      stage = this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
      // render
      return (
        <f7-badge class="eb-cursor-pointer" nativeOnClick={this.onClickStage}>
          {stage}
        </f7-badge>
      );
    },
  },
  render() {
    return (
      <f7-nav-title>
        <div>{this.layoutManager.page_getTitle()}</div>
        <div class="subtitle">{this._renderStage()}</div>
      </f7-nav-title>
    );
  },
};
