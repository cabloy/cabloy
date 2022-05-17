// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutmobile').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ebLayoutButtonBase],
    data() {
      return {};
    },
    mounted() {
      this._checkSpecialPath();
    },
    created() {
      this.$meta.eventHub.$on('appMine:open', this.onAppMineOpen);
    },
    beforeDestroy() {
      this.$meta.eventHub.$off('appMine:open', this.onAppMineOpen);
    },
    methods: {
      onAppMineOpen() {
        this.onPerformClick();
      },
      _checkSpecialPath() {
        const query = this.$utils.parseUrlQuery();
        const path = query && query.__to;
        if (!path) return false;
        if (path === 'mine') {
          this.onPerformClick();
        }
      },
    },
    render() {
      return (
        <eb-link-color
          class={this.buttonClass}
          iconMaterial={this.buttonIcon && this.buttonIcon.material}
          iconF7={this.buttonIcon && this.buttonIcon.f7}
          text={this.buttonLabel}
          propsOnPerform={this.onPerformClick}
          stats_params={{ module: 'a-user', name: 'user' }}
        ></eb-link-color>
      );
    },
  };
}
