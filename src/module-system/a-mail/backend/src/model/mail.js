module.exports = app => {
  class Mail extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aMail', options: { disableDeleted: false } });
    }
  }
  return Mail;
};
