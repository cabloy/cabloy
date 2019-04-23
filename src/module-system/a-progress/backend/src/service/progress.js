module.exports = app => {

  class Progress extends app.Service {

    async check({ progressId, counter }) {
      // item
      const item = await this.ctx.model.queryOne(`
        select * from aProgress a
          where a.iid=? and a.progressId=? and a.counter>?
        `, [ this.ctx.instance.id, progressId, counter ]);
      // delete
      if (item && item.done !== 0) {
        await this.ctx.model.progress.delete({ id: item.id });
      }
      // ok
      return item;
    }

    async abort({ progressId }) {
      await this.ctx.model.query(`
        update aProgress set abort=1
          where iid=? and progressId=?
        `, [ this.ctx.instance.id, progressId ]);
    }

  }

  return Progress;
};
