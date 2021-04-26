module.exports = app => {
  class Share extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aShare', options: { disableDeleted: false } });
    }
  }
  return Share;
};
