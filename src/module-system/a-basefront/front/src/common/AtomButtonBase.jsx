// eslint-disable-next-line
export default function (Vue) {
  return {
    meta: {},
    props: {
      layoutManager: {
        type: Object,
      },
      button: {
        type: Object,
      },
    },
    data() {
      return {};
    },
    computed: {
      buttonConfig() {
        return this.button.config;
      },
      buttonIcon() {
        return this.buttonConfig.icon;
      },
      buttonIconSize() {
        const iconSize = this.buttonIcon && this.buttonIcon.size;
        if (iconSize) return iconSize;
        return 24;
      },
      buttonLabel() {
        if (!this.buttonConfig.showLabel) return null;
        return this.buttonConfig.titleLocale;
      },
      buttonTooltip() {
        if (this.buttonConfig.showLabel) return null;
        return this.buttonConfig.titleLocale;
      },
      buttonClass() {
        return {
          'button-separator': this.buttonConfig.showSeparator,
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
      onPerformClick(event) {
        return this.button.onPerform(event);
      },
    },
    render() {
      return (
        <eb-link
          class={this.buttonClass}
          iconMaterial={this.buttonIcon && this.buttonIcon.material}
          iconF7={this.buttonIcon && this.buttonIcon.f7}
          iconSize={this.buttonIconSize}
          text={this.buttonLabel}
          tooltip={this.buttonTooltip}
          propsOnPerform={event => this.onPerformClick(event)}
        ></eb-link>
      );
    },
  };
}
