const fs = require('fs');
const path = require('path');
const require3 = require('require3');
const glob = require3('globby');
const mkdirp = require3('mkdirp');
const isTextOrBinary = require3('istextorbinary');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    constructor(cli) {
      this.cli = cli;
    }

    get console() {
      return this.cli.console;
    }

    get helper() {
      return this.cli.helper;
    }

    get moduleConfig() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    get fileMapping() {
      return this.moduleConfig.template.fileMapping;
    }

    getTemplateDir({ module, path: _path }) {
      const _module = ctx.app.meta.modules[module];
      return path.join(_module.root, 'backend/cli/templates', _path);
    }

    async renderDir({ templateDir, targetDir, context }) {
      const { argv } = context;
      // files
      const files = glob.sync('**/*', {
        cwd: templateDir,
        dot: true,
        onlyFiles: false,
        followSymlinkedDirectories: false,
      });
      // loop
      for (const file of files) {
        const { dir: dirname, base: basename } = path.parse(file);
        const from = path.join(templateDir, file);
        const fileName = this.fileMapping[basename] || basename;
        const to = path.join(targetDir, dirname, ctx.bean.util.replaceTemplate(fileName, argv));

        const stats = fs.lstatSync(from);
        if (stats.isSymbolicLink()) {
          const target = fs.readlinkSync(from);
          fs.symlinkSync(target, to);
          await this.console.log(`${to} link to ${target}`);
        } else if (stats.isDirectory()) {
          mkdirp.sync(to);
        } else if (stats.isFile()) {
          const content = fs.readFileSync(from);
          await this.console.log(`write to ${to}`);
          // check if content is a text file
          let result;
          if (!isTextOrBinary.isTextSync(from, content)) {
            result = content;
          } else {
            result = await this.renderContent({ content: content.toString('utf8'), context });
          }
          fs.writeFileSync(to, result);
        } else {
          await this.console.log(`ignore ${file} only support file, dir, symlink`);
        }
      }
      return files;
    }

    async renderContent({ content, context }) {
      return content;
    }
  }
  return Local;
};
