export default {
  methods: {
    async _onActionDraft() {
      const { item } = this.$props;
      await this._onActionReadGeneral({ atomId: item.atomIdDraft });
    },
  },
};
