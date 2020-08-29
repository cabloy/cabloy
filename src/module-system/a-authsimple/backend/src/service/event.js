module.exports = app => {
  class Event extends app.Service {

    async accountMigration({ data }) {
      // check userIdFrom
      const authSimple = await this.ctx.model.authSimple.get({ userId: data.userIdFrom });
      if (authSimple) {
        // delete old record
        await this.ctx.model.query(
          'delete from aAuthSimple where deleted=0 and iid=? and userId=?',
          [ this.ctx.instance.id, data.userIdTo ]
        );
        // update
        await this.ctx.model.query(
          'update aAuthSimple a set a.userId=? where a.deleted=0 and a.iid=? and a.userId=?',
          [ data.userIdTo, this.ctx.instance.id, data.userIdFrom ]
        );
      }
    }

  }

  return Event;
};
