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
      setTabActive() {
        this.$f7.tab.show(`#eb-layout-tab-${this.button.buttonFullName.replace(':', '_')}`);
      },
    },
  };
}
