// eslint-disable-next-line
export default function (Vue) {
  return {
    meta: {},
    props: {
      button: {
        type: Object,
      },
    },
    data() {
      return {};
    },
    computed: {
      buttonConfig() {
        return this.button.options.resourceConfig;
      },
      buttonIcon() {
        return this.buttonConfig.icon;
      },
      buttonShowLabel() {
        if (this.buttonConfig.showLabel !== undefined) return this.buttonConfig.showLabel;
        return this.button.group.toolbarConfig.meta.labels;
      },
      buttonLabel() {
        if (!this.buttonShowLabel) return null;
        return this.button.options.titleLocale;
      },
      buttonClass() {
        return {
          'tab-link': true,
          'tab-link-active': this.button.buttonFullName === this.button.group.buttonActiveFullName,
        };
      },
    },
    mounted() {
      this.$emit('buttonReal:ready', this);
    },
    beforeDestroy() {
      this.$emit('buttonReal:destroy', this);
    },
    methods: {
      onPerformClick() {
        this.setTabActive();
      },
      getDomView() {
        return this.$$(`#eb-layout-tab-${this.button.buttonFullName.replace(':', '_')}`);
      },
      getView() {
        const domView = this.getDomView();
        return domView[0].__vue__;
      },
      setTabActive() {
        this.$f7.tab.show(this.getDomView());
      },
    },
    render() {
      return (
        <eb-link
          class={this.buttonClass}
          iconMaterial={this.buttonIcon && this.buttonIcon.material}
          iconF7={this.buttonIcon && this.buttonIcon.f7}
          text={this.buttonLabel}
          propsOnPerform={this.onPerformClick}
        ></eb-link>
      );
    },
  };
}
