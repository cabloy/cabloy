// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebAtomButtonBase = Vue.prototype.$meta.module.get('a-layoutfront').options.mixins.ebAtomButtonBase;
  return {
    mixins: [ebAtomButtonBase],
    data() {
      return {};
    },
    created() {
      this.button.hide();
    },
    methods: {},
    render() {
      return (
        <eb-link
          class={this.buttonClass}
          iconF7={this.$meta.util.screenfull.isFullscreen ? '::fullscreen-exit' : '::fullscreen'}
          tooltip={this.$meta.util.screenfull.isFullscreen ? this.$text('Exit Fullscreen') : this.$text('Fullscreen')}
          propsOnPerform={this.onPerform}
        ></eb-link>
      );
    },
  };
}
