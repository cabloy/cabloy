module.exports = app => {

  class Progress extends app.Service {

    async check({ progressId, counter }) {
      // loop
      const timeStart = new Date();
      while (true) {
        // item
        const item = await this.ctx.model.queryOne(`
        select * from aProgress a
          where a.iid=? and a.progressId=? and a.counter>?
        `, [ this.ctx.instance.id, progressId, counter ]);
        // delete
        if (item && item.done !== 0) {
          await this.ctx.model.progress.delete({ id: item.id });
        }
        // return if found
        if (item) return item;
        // check the delayTimeout if the same
        const timeEnd = new Date();
        const time = (timeEnd.valueOf() - timeStart.valueOf());
        if (time >= this.ctx.config.check.timeoutDelay) {
          // timeout
          return null;
        }
        // sleep 1s then continue
        await this.ctx.meta.util.sleep(1000);
      }
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
