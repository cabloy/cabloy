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
      const jsFile = await this._prepareJSFile();
      const DemoFn = ctx.app.meta.util.requireDynamic(jsFile);
      const demo = new (DemoFn(ctx))();
      if (!demo[method]) throw new Error(`method not found: ${method}`);
      return await demo[method]();
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
