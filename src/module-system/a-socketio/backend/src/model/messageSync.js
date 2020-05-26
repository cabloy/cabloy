module.exports = app => {
  class MessageSync extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aSocketIOMessageSync', options: { disableDeleted: false } });
    }
  }
  return MessageSync;
};
