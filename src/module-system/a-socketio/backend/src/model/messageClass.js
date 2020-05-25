module.exports = app => {
  class MessageClass extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aSocketIOMessageClass', options: { disableDeleted: false } });
    }
  }
  return MessageClass;
};
