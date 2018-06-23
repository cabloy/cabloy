module.exports = app => {

  class UserAgent extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aUserAgent', options: { disableDeleted: true } });
    }

  }

  return UserAgent;
};
