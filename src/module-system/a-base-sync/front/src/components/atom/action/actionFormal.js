export default {
  methods: {
    async _onActionFormal() {
      const { item } = this.$props;
      await this._onActionReadGeneral({ atomId: item.atomIdFormal });
    },
  },
};
