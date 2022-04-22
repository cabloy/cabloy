module.exports = ctx => {
  class Cli extends ctx.app.meta.CliBase(ctx) {
    async meta({ command, context, user }) {
      const meta = await super.meta({ command, context, user });
      return meta;
    }
    async execute({ command, context, user }) {
      // super
      await super.execute({ command, context, user });
      // chalk
      let text = this.helper.chalk.keyword('orange')('chalk test');
      await this.log({ text });
      // boxen
      text = this.helper.boxen({ text: 'boxen test' });
      await this.log({ text });
      // table
      const table = this.helper.newTable({
        head: ['Name', 'Sex'],
        colWidths: [20, 20],
      });
      table.push(['Tom', 'M']);
      table.push(['Jane', 'F']);
      await this.log({ text: 'table test' });
      await this.log({ text: table.toString() });
      //  level one
      await this._levelOne({ progressNo: 0 });
    }

    async _levelOne({ progressNo }) {
      const total = 2;
      let current = 0;
      for (let i = 0; i < total; i++) {
        const text = `${ctx.text('Level One')}: ${i + 1}`;
        await this.log({
          progressNo,
          total,
          progress: current++,
          text,
        });
        // sleep
        await ctx.bean.util.sleep(200);
        // level two
        await this._levelTwo({ progressNo: progressNo + 1 });
      }
    }

    async _levelTwo({ progressNo }) {
      const total = 2;
      let current = 0;
      for (let i = 0; i < total; i++) {
        const text = `${ctx.text('Level Two')}: ${i + 1}`;
        await this.log({
          progressNo,
          total,
          progress: current++,
          text,
        });
        // sleep
        await ctx.bean.util.sleep(200);
        // level two
        await this._levelThree({ progressNo: progressNo + 1 });
      }
    }

    async _levelThree({ progressNo }) {
      const total = 3;
      let current = 0;
      for (let i = 0; i < total; i++) {
        const text = `${ctx.text('Level Three')}: ${i + 1}`;
        await this.log({
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
