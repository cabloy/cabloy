module.exports = ctx => {
  class Demo {
    async execute(/* argv */) {
      // welcome
      await this.console.log('\n==== Welcome to CabloyJS! ====\n');
      // chalk
      let text = this.helper.chalk.keyword('orange')('chalk test');
      await this.console.log({ text });
      // boxen
      text = this.helper.boxen({ text: 'boxen test' });
      await this.console.log({ text });
      // table
      const table = this.helper.newTable({
        head: ['Name', 'Sex'],
        colWidths: [20, 20],
      });
      table.push(['Tom', 'M']);
      table.push(['Jane', 'F']);
      await this.console.log({ text: 'table test' });
      await this.console.log({ text: table.toString() });
      return 222;
      const atomClass = { module: 'test-party', atomClassName: 'party' };
      const user = ctx.state.user.op;
      const partyKeyDraft = await ctx.bean.atom.write({
        atomClass,
        atomStage: 1,
        options: { preferredRole: true },
        item: { atomName: 'test:all-stage', personCount: 2 },
        user,
      });

      return partyKeyDraft;
      // const partyKeyDraft = await ctx.bean.atom.write({
      //   atomClass,
      //   options: { preferredRole: true },
      //   item: { atomName: 'test:all', personCount: 3 },
      //   user,
      // });
      // await ctx.bean.atom.submit({
      //   key: partyKeyDraft,
      //   options: { ignoreFlow: true },
      //   user,
      // });
      // return 'hello world';
    }
  }
  return Demo;
};
