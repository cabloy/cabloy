const path = require('path');
const fse = require('fs-extra');

const __JSContent = `module.exports = ctx => {
  class Demo {
    async execute(/* argv */) {
      // welcome
      await this.console.log('\\n==== Welcome to CabloyJS! ====\\n');
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
      // ok
      return 'hello world';
    }
  }
  return Demo;
};
`;

module.exports = ctx => {
  class Local {
    async demoExecute({ method, argv, cli }) {
      // js file
      const jsFile = await this._prepareJSFile({ cli });
      // require
      const DemoFn = ctx.app.meta.util.requireDynamic(jsFile);
      // demo
      const demo = new (DemoFn(ctx))();
      if (!demo[method]) throw new Error(`method not found: ${method}`);
      // console/helper
      demo.console = cli.console;
      demo.helper = cli.helper;
      // execute
      const timeBegin = new Date();
      let result;
      if (argv.transaction === false) {
        result = await demo[method](argv);
      } else {
        result = await ctx.transaction.begin(async () => {
          return await demo[method](argv);
        });
      }
      const timeEnd = new Date();
      const duration = timeEnd - timeBegin;
      // ok
      return { timeBegin, timeEnd, duration, result };
    }

    async _prepareJSFile({ cli }) {
      // prepare
      const jsFile = path.join(ctx.app.baseDir, 'demo/index.js');
      const exists = await fse.exists(jsFile);
      if (!exists) {
        await fse.outputFile(jsFile, __JSContent);
      }
      // log
      let log = cli.helper.chalk.keyword('cyan')('> ./src/backend/demo/index.js');
      await cli.console.log(log);
      const url = ctx.bean.base.getAbsoluteUrl('/api/a/clibooster/tools/demo');
      log = cli.helper.chalk.keyword('cyan')(`> ${url}\n`);
      await cli.console.log(log);
      // ok
      return jsFile;
    }
  }
  return Local;
};
