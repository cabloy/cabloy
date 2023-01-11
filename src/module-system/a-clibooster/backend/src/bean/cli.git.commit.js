const path = require('path');

module.exports = ctx => {
  class Cli extends ctx.app.meta.CliBase(ctx) {
    async execute({ user }) {
      const { cwd, argv } = this.context;
      // super
      await super.execute({ user });
      const files = argv._;
      const total = files.length;
      for (let index = 0; index < total; index++) {
        const file = files[index];
        // log
        await this.console.log({
          progressNo: 0,
          total,
          progress: index,
          text: file,
        });
        // transform
        const fileSrc = path.join(cwd, file);
        const pos = fileSrc.lastIndexOf('.js');
        if (pos === -1) continue;
        const fileDest = fileSrc.substr(0, pos) + '.min.js';
        this._transform(fileSrc, fileDest);
      }
    }
  }

  return Cli;
};
