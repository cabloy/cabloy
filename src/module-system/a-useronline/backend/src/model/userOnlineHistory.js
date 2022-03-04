module.exports = app => {
  class UserOnlineHistory extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aUserOnlineHistory', options: { disableDeleted: false } });
    }
  }
  return UserOnlineHistory;
};
