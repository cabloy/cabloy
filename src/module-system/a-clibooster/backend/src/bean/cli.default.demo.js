module.exports = ctx => {
  class Cli extends ctx.app.meta.CliBase(ctx) {
    async meta({ command, context, user }) {
      const meta = await super.meta({ command, context, user });
      return meta;
    }
    async execute({ progressId, command, context, user }) {
      // super
      await super.meta({ progressId, command, context, user });
      //  level one
      await this._levelOne({ progressId, progressNo: 0 });
      // chalk
      const text = this.helper.chalk.keyword('orange')('chalk test');
      this.log({ progressId, text });
    }

    async _levelOne({ progressId, progressNo }) {
      const total = 2;
      let current = 0;
      for (let i = 0; i < total; i++) {
        const text = `${ctx.text('Level One')}: ${i + 1}`;
        await this.log({
          progressId,
          progressNo,
          total,
          progress: current++,
          text,
        });
        // sleep
        await ctx.bean.util.sleep(200);
        // level two
        await this._levelTwo({ progressId, progressNo: progressNo + 1 });
      }
    }

    async _levelTwo({ progressId, progressNo }) {
      const total = 2;
      let current = 0;
      for (let i = 0; i < total; i++) {
        const text = `${ctx.text('Level Two')}: ${i + 1}`;
        await this.log({
          progressId,
          progressNo,
          total,
          progress: current++,
          text,
        });
        // sleep
        await ctx.bean.util.sleep(200);
        // level two
        await this._levelThree({ progressId, progressNo: progressNo + 1 });
      }
    }

    async _levelThree({ progressId, progressNo }) {
      const total = 3;
      let current = 0;
      for (let i = 0; i < total; i++) {
        const text = `${ctx.text('Level Three')}: ${i + 1}`;
        await this.log({
          progressId,
          progressNo,
          total,
          progress: current++,
          text,
        });
        // sleep
        await ctx.bean.util.sleep(200);
      }
    }
  }

  return Cli;
};
