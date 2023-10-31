export default {
  props: {
    layoutManager: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    async onActionSaveBefore({ item }) {
      await this._onActionCheckContent({ item });
    },
    async onActionSubmitBefore(/* { item }*/) {
      // do nothing
    },
    async _onActionCheckContent({ item }) {
      const useStoreUtils = await this.$store.use('a/markdown/utils');
      await useStoreUtils.checkContent({ ctx: this.layoutManager, content: item.content });
    },
  },
};
