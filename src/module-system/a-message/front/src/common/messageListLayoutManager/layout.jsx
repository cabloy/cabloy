export default {
  data() {
    return {};
  },
  methods: {
    layout_onGetLayoutConfigKeyCurrent() {
      const messageClass = this.base_messageClass;
      const messageClassKey = messageClass ? `${messageClass.module}_${messageClass.messageClassName}` : null;
      return `message.${messageClassKey}.render.list.layout.current.${this.$view.size}`;
    },
    layout_onGetLayoutNames() {
      const configViewSize = this.$meta.util.getProperty(this.layout.configFull, 'info.layout.viewSize');
      return configViewSize[this.$view.size];
    },
    async layout_onPrepareConfigFull() {
      // configMessageBase
      const layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
        layoutKey: 'a-message:layoutMessageListBase',
      });
      this.base.configMessageBase = layoutItem.content;
      // ok
      return this.base.configMessageBase;
    },
    layout_renderLayout() {
      return this.layout_renderLayout_template_list();
    },
  },
};
