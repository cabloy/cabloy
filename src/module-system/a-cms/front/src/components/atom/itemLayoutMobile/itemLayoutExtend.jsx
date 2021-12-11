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
    async onActionSubmitBefore({ item }) {
      await this._onActionCheckContent({ item });
    },
    async _onActionCheckContent({ item }) {
      const action = {
        actionModule: 'a-markdown',
        actionComponent: 'utils',
        name: 'checkContent',
      };
      await this.$meta.util.performAction({ ctx: this.layoutManager, action, item });
    },
  },
};
