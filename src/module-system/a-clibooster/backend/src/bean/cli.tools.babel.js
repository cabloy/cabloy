const path = require('path');

const babel = require('@babel/core');
const UglifyJS = require('uglify-js');
const fse = require('fs-extra');

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

    _transform(fileSrc, fileDest) {
      let content = fse.readFileSync(fileSrc);
      // transform
      content = babel.transform(content, {
        ast: false,
        babelrc: false,
        presets: ['@babel/preset-env'],
        plugins: [],
      }).code;
      // uglify
      const output = UglifyJS.minify(content);
      if (output.error) throw new Error(`${output.error.name}: ${output.error.message}`);
      content = output.code;
      // output
      fse.outputFileSync(fileDest, content);
    }
  }

  return Cli;
};
