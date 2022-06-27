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
      configPopup() {
        return this.$meta.vueLayout.layoutConfig.popup;
      },
    },
    methods: {
      onPerform() {
        this.$meta.vueLayout.setViewPopup(!this.configPopup);
      },
    },
    render() {
      return (
        <eb-link
          class={this.buttonClass}
          iconF7={this.configPopup ? '::popup' : '::layout-columns'}
          iconSize={this.buttonIconSize}
          tooltip={this.configPopup ? this.$text('ViewPopupEnabled') : this.$text('ViewPopupDisabled')}
          propsOnPerform={this.onPerform}
        ></eb-link>
      );
    },
  };
}
