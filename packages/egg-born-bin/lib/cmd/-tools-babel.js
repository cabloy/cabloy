const path = require('path');
const chalk = require('chalk');
const babel = require('@babel/core');
const UglifyJS = require('uglify-js');
const fse = require('fs-extra');
const Command = require('@zhennann/egg-bin').Command;

class ToolsBabelCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin tools-babel';
  }

  *run({ cwd, argv }) {
    console.log('run tools babel at %s', cwd);

    const files = argv._;
    for (const file of files) {
      const fileSrc = path.join(cwd, file);
      const pos = fileSrc.lastIndexOf('.js');
      if (pos === -1) continue;
      const fileDest = fileSrc.substr(0, pos) + '.min.js';
      this._transform(fileSrc, fileDest);
    }
    // done
    console.log(chalk.cyan('  tools-babel successfully!'));
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

  description() {
    return 'tools babel';
  }
}

module.exports = ToolsBabelCommand;
