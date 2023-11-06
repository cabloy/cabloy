const path = require('path');
const fse = require('fs-extra');

const __JSContent = `module.exports = ctx => {
  class Demo {
    async execute() {
      return 'hello world';
    }
  }
  return Demo;
};
`;

module.exports = ctx => {
  class Local {
    async demoExecute({ method }) {
      // js file
      const jsFile = await this._prepareJSFile();
      // require
      const DemoFn = ctx.app.meta.util.requireDynamic(jsFile);
      // demo
      const demo = new (DemoFn(ctx))();
      if (!demo[method]) throw new Error(`method not found: ${method}`);
      // execute
      return await ctx.transaction.begin(async () => {
        return await demo[method]();
      });
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
