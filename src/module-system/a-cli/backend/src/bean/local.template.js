const fs = require('fs');
const path = require('path');
const require3 = require('require3');
const glob = require3('globby');
const mkdirp = require3('mkdirp');
const isTextOrBinary = require3('istextorbinary');
const ejs = require3('@zhennann/ejs');

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
      return this.moduleConfig.template.render.fileMapping;
    }

    get filesIgnore() {
      return this.moduleConfig.template.render.ignore;
    }

    resolvePath({ module, path: _path }) {
      const _module = ctx.app.meta.modules[module];
      return path.join(_module.root, 'backend/cli/templates', _path);
    }

    async renderDir({ context, targetDir, templateDir }) {
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
        if (this.filesIgnore.includes(basename)) continue;
        const templateFile = path.join(templateDir, file);
        const fileName = this.fileMapping[basename] || basename;
        const targetFile = path.join(targetDir, dirname, ctx.bean.util.replaceTemplate(fileName, argv));
        await this.renderFile({ context, targetFile, templateFile });
      }
      return files;
    }

    async renderFile({ context, targetFile, templateFile }) {
      const stats = fs.lstatSync(templateFile);
      if (stats.isSymbolicLink()) {
        const target = fs.readlinkSync(templateFile);
        fs.symlinkSync(target, targetFile);
        await this.console.log(`${targetFile} link to ${target}`);
      } else if (stats.isDirectory()) {
        mkdirp.sync(targetFile);
      } else if (stats.isFile()) {
        let content = fs.readFileSync(templateFile);
        await this.console.log(`write to ${targetFile}`);
        // check if content is a text file
        let result;
        let changed;
        if (!isTextOrBinary.isTextSync(templateFile, content)) {
          result = content;
        } else {
          content = content.toString('utf8');
          result = await this.renderContent({ context, content });
          changed = content !== result;
        }
        // save
        fs.writeFileSync(targetFile, result);
        // format
        if (changed) {
          await this.helper.formatFile({ fileName: targetFile });
        }
      } else {
        await this.console.log(`ignore ${templateFile}, only support file, dir, symlink`);
      }
    }

    async renderContent({ context, content }) {
      const data = this.getEjsData({ context });
      const options = this.getEjsOptions();
      return await ejs.render(content, data, options);
    }

    getEjsOptions() {
      return {
        async: true,
        cache: false,
        compileDebug: ctx.app.meta.isTest || ctx.app.meta.isLocal,
        outputFunctionName: 'echo',
        rmWhitespace: false,
      };
    }

    getEjsData({ context }) {
      return {
        ...context,
        ctx,
      };
    }
  }
  return Local;
};
