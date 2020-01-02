module.exports = app => {
  class WechatUser extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aWechatUser', options: { disableDeleted: false } });
    }
  }
  return WechatUser;
};
