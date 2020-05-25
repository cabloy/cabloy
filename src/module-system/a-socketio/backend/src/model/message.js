module.exports = app => {
  class Message extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aSocketIOMessage', options: { disableDeleted: false } });
    }
  }
  return Message;
};
