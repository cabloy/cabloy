module.exports = app => {

  class Progress extends app.Service {

    async check({ progressId, counter, user }) {
      return await this.ctx.model.queryOne(`
        select * from aProgress a
          where a.iid=? and a.progressId=? and a.counter>? and a.userId=?
        `, [ this.ctx.instance.id, progressId, counter, user.id ]);
    }

    async abort({ progressId, user }) {
      await this.ctx.model.query(`
        update aProgress set abort=1
          where iid=? and progressId=? and userId=?
        `, [ this.ctx.instance.id, progressId, user.id ]);
    }

    async delete({ progressId, user }) {
      await this.ctx.model.query(`
        delete from aProgress
          where iid=? and progressId=? and userId=?
        `, [ this.ctx.instance.id, progressId, user.id ]);
    }

  }

  return Progress;
};
