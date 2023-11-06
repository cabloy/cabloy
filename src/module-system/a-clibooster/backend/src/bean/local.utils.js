const path = require('path');
const fse = require('fs-extra');

const __JSContent = `module.exports = ctx => {
  class Demo {
    async execute(/* argv */) {
      return 'hello world';
    }
  }
  return Demo;
};
`;

module.exports = ctx => {
  class Local {
    async demoExecute({ method, argv }) {
      // js file
      const jsFile = await this._prepareJSFile();
      // require
      const DemoFn = ctx.app.meta.util.requireDynamic(jsFile);
      // demo
      const demo = new (DemoFn(ctx))();
      if (!demo[method]) throw new Error(`method not found: ${method}`);
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

    async _prepareJSFile() {
      const jsFile = path.join(ctx.app.baseDir, 'demo.js');
      const exists = await fse.exists(jsFile);
      if (!exists) {
        await fse.outputFile(jsFile, __JSContent);
      }
      return jsFile;
    }
  }
  return Local;
};
