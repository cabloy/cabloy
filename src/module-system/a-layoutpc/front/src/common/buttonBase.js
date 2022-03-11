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
      buttonIconSize() {
        const iconSize = this.buttonIcon && this.buttonIcon.size;
        if (iconSize) return iconSize;
        if (this.$$(this.button.$el).parents('.eb-layout-header').length > 0) return 24;
        return 16;
      },
      buttonLabel() {
        if (!this.buttonConfig.showLabel) return null;
        return this.button.options.titleLocale;
      },
      buttonTooltip() {
        if (this.buttonConfig.showLabel) return null;
        return this.button.options.titleLocale;
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
      onPerformClick() {
        const action = this.$utils.extend({}, this.buttonConfig, {
          navigateOptions: {
            scene: this.buttonConfig.scene,
            sceneOptions: this.buttonConfig.sceneOptions,
          },
        });
        this.$meta.util.performAction({ ctx: this, action, item: null });
      },
    },
  };
}
