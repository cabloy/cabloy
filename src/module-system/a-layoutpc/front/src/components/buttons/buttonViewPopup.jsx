// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutpc').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ebLayoutButtonBase],
    data() {
      return {};
    },
    computed: {
      configViewPopup() {
        return this.$meta.vueLayout.layoutConfig.viewPopup;
      },
    },
    methods: {
      onPerform() {
        this.$meta.vueLayout.setViewPopup(!this.configViewPopup);
      },
    },
    render() {
      return (
        <eb-link
          class={this.buttonClass}
          iconF7={this.configViewPopup ? '::popup' : '::layout-columns'}
          iconSize={this.buttonIconSize}
          tooltip={this.configViewPopup ? this.$text('ViewPopupEnabled') : this.$text('ViewPopupDisabled')}
          propsOnPerform={this.onPerform}
        ></eb-link>
      );
    },
  };
}
