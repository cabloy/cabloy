export default {
  methods: {
    async _onActionPartyOverBulk() {
      const { ctx } = this.$props;
      // confirm
      await ctx.$view.dialog.confirm();
      // overBulk
      const data = await ctx.$api.post('/a/baseadmin/role/buildBulk');
      const progressId = data.progressId;
      await ctx.$view.dialog.progressbar({ progressId, title: this.$text('Build') });
      // dirty
      ctx.$meta.eventHub.$emit('role:dirty', { dirty: false });
    },
  },
};
