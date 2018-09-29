#!/usr/bin/env node

const co = require('co');
const Command = require('egg-init');
const path = require('path');
const glob = require('glob');
const fse = require('fs-extra');
const isTextOrBinary = require('istextorbinary');

co(function* () {

  const options = {
    name: 'egg-born',
    configName: 'egg-born-init-config',
    pkgInfo: require('../package.json'),
  };

  const command = new Command(options);

  command.printUsage = function() {
    this.log(`usage:
      - cd ${this.targetDir}
      - npm install
      - npm run dev:front
      - npm run build:front
      - npm run dev:backend
      - npm run debug:backend
      - npm run lint
      - npm run test:backend
      - npm run cov:backend
      - npm run start:backend
      - npm run stop:backend
    `);
  };

  // 'mem-fs-editor' may cause a problem on windows
  command.processFiles = function* (targetDir, templateDir) {
    const src = path.join(templateDir, 'boilerplate');
    const locals = yield this.askForVariable(targetDir, templateDir);
    const files = glob.sync('**/*', { cwd: src, dot: true, nodir: true });
    files.forEach(file => {
      const from = path.join(src, file);
      const to = path.join(targetDir, this.replaceTemplate(this.fileMapping[file] || file, locals));
      this.log('write to %s', to);
      let content = fse.readFileSync(from);
      if (isTextOrBinary.isTextSync(from, content)) {
        content = this.replaceTemplate(content, locals);
      }
      fse.outputFileSync(to, content);
    });
    return files;
  };

  yield command.run(process.cwd(), process.argv.slice(2));

}).catch(err => {
  console.error(err.stack);
  process.exit(1);
});
