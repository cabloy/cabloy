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
    async layout_onPrepareConfigFull() {
      // configMessageBase
      const useStoreLayout = await this.$store.use('a/baselayout/layout');
      const layoutItem = await useStoreLayout.getLayoutItem({ layoutKey: 'a-message:layoutMessageListBase' });
      this.base.configMessageBase = layoutItem.content;
      // ok
      return this.base.configMessageBase;
    },
  },
};
