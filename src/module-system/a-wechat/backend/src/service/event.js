module.exports = app => {

  class Event extends app.Service {

    async accountMigration({ data }) {
      // aWechatUser
      await this.ctx.model.query(
        'update aWechatUser a set a.userId=? where a.iid=? and a.userId=?',
        [ data.userIdTo, this.ctx.instance.id, data.userIdFrom ]
      );
    }

  }

  return Event;
};
