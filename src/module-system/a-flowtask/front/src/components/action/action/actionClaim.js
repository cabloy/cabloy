export default {
  methods: {
    async _onActionClaim() {
      // ensure claim
      await this._ensureClaimed();
    },
  },
};
