/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 235:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const extend = require3('@zhennann/extend');

let __commandsMap;
let __commandsAll;

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Cli {
    async meta({ context, user }) {
      try {
        // reload freeze
        ctx.app.meta.reload.freeze();
        // command
        const { argv } = context;
        const cliFullName = argv.cliFullName;
        const command = await this._findCliCommandAndCheckRight({ cliFullName, user });
        // command bean
        const beanCommand = ctx.bean._newBean(command.beanFullName, { command, context });
        if (!beanCommand) throw new Error(`cli command bean not found: ${command.beanFullName}`);
        // meta
        return await beanCommand.meta({ user });
      } finally {
        // reload unfreeze
        ctx.app.meta.reload.unfreeze();
      }
    }

    async execute({ progressId, context, user }) {
      // directly
      if (!progressId) {
        await this._progressInBackground({ progressId, context, user });
        return null;
      }
      // create progress
      await ctx.bean.progress.create({ progressId });
      // background
      ctx.runInBackground(async () => {
        await this._progressInBackground({ progressId, context, user });
      });
      // return progressId
      return { progressId };
    }

    async _progressInBackground({ progressId, context, user }) {
      try {
        // reload freeze
        ctx.app.meta.reload.freeze();
        // command
        const { argv } = context;
        const cliFullName = argv.cliFullName;
        const command = await this._findCliCommandAndCheckRight({ cliFullName, user });
        // command bean
        const beanCommand = ctx.bean._newBean(command.beanFullName, { command, context, progressId });
        if (!beanCommand) throw new Error(`cli command bean not found: ${command.beanFullName}`);
        // execute
        await beanCommand.execute({ user });
        // progress done
        await ctx.bean.progress.done({ progressId, message: ctx.text('CliDone') });
      } catch (err) {
        // progress error
        let message;
        if (ctx.app.meta.isProd) {
          message = err.message;
        } else {
          message = err.stack || err.message;
        }
        await ctx.bean.progress.error({ progressId, message });
        // throw err
        throw err;
      } finally {
        // reload unfreeze
        ctx.app.meta.reload.unfreeze();
      }
    }

    async _findCliCommandAndCheckRight({ cliFullName, user }) {
      // command
      const command = this._findCliCommand({ cliFullName });
      // check right first
      const right = await ctx.bean.resource.checkRightResource({
        atomStaticKey: command.resource.atomStaticKey,
        user,
      });
      if (!right) ctx.throw(403);
      return command;
    }

    _findCliCommand({ cliFullName }) {
      if (!__commandsMap) {
        this._collectCommands();
      }
      const command = __commandsMap[cliFullName];
      if (!command) throw new Error(`cli command not found: ${cliFullName}`);
      return command;
    }

    _commandsAll() {
      return __commandsAll;
    }

    _collectCommands() {
      const _commandsMap = {};
      const _commandsAll = {};
      for (const module of ctx.app.meta.modulesArray) {
        const moduleName = module.info.relativeName;
        const commands = module.main.meta && module.main.meta.cli && module.main.meta.cli.commands;
        if (!commands) continue;
        const _commandsModule = (_commandsAll[moduleName] = {});
        for (const groupName in commands) {
          const group = commands[groupName];
          const _commandsGroup = (_commandsModule[groupName] = {});
          for (const key in group) {
            const command = group[key];
            const fullKey = `${moduleName}:${groupName}:${key}`;
            // command
            const _command = extend(true, {}, command);
            // bean
            const beanName = command.bean;
            let beanFullName;
            if (typeof beanName === 'string') {
              beanFullName = `${moduleName}.cli.${beanName}`;
            } else {
              beanFullName = `${beanName.module || moduleName}.cli.${beanName.name}`;
            }
            _command.beanFullName = beanFullName;
            // resource
            let atomStaticKey = _command.resource && _command.resource.atomStaticKey;
            if (!atomStaticKey) throw new Error(`cli command resource.atomStaticKey not specified: ${fullKey}`);
            if (atomStaticKey.indexOf(':') === -1) {
              atomStaticKey = `${moduleName}:${atomStaticKey}`;
            }
            _command.resource.atomStaticKey = atomStaticKey;
            // ok
            _commandsMap[fullKey] = _commandsGroup[key] = _command;
          }
        }
      }
      // ok
      __commandsMap = _commandsMap;
      __commandsAll = _commandsAll;
    }
  }
  return Cli;
};


/***/ }),

/***/ 778:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(638);
const eggBornUtils = require3('egg-born-utils');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CliBase {
    constructor(options) {
      this.options = options;
      this.console = ctx.bean._newBean(`${moduleInfo.relativeName}.local.console`, this);
      this.helper = ctx.bean._newBean(`${moduleInfo.relativeName}.local.helper`, this);
      this.template = ctx.bean._newBean(`${moduleInfo.relativeName}.local.template`, this);
      this.cabloyConfig = null;
    }

    get context() {
      return this.options.context;
    }

    async meta({ user }) {
      await this._loadCabloyConfig();
      const metaLocale = this._commandMeta();
      return metaLocale;
    }

    async execute(/* { user } */) {
      await this._loadCabloyConfig();
    }

    async _loadCabloyConfig() {
      const { argv } = this.context;
      this.cabloyConfig = eggBornUtils.cabloyConfig;
      await this.cabloyConfig.load({ projectPath: argv.projectPath });
    }

    _commandMeta() {
      const { command } = this.options;
      const { argv } = this.context;
      const meta = {};
      meta.info = this._commandMeta_info({ info: command.info, argv });
      meta.options = this._commandMeta_options({ options: command.options, argv });
      meta.groups = this._commandMeta_groups({ groups: command.groups, argv });
      return meta;
    }

    _commandMeta_groups({ groups }) {
      const metaGroups = {};
      if (groups) {
        for (const groupName in groups) {
          const group = groups[groupName];
          metaGroups[groupName] = this._commandMeta_group({ group });
        }
      }
      return metaGroups;
    }

    _commandMeta_group({ group }) {
      const metaGroup = {
        description: ctx.text(group.description),
        condition: group.condition,
        questions: {},
      };
      for (const key in group.questions) {
        const question = group.questions[key];
        metaGroup.questions[key] = {
          ...question,
          message: ctx.text(question.message),
        };
      }
      return metaGroup;
    }

    _commandMeta_options({ options }) {
      const metaOptions = {};
      if (options) {
        for (const key in options) {
          const option = options[key];
          metaOptions[key] = {
            ...option,
            description: ctx.text(option.description),
          };
        }
      }
      return metaOptions;
    }

    _commandMeta_info({ info, argv }) {
      // info
      const metaInfo = {
        version: info.version,
        title: ctx.text(info.title),
        usage: ctx.text(info.usage),
      };
      // usage
      if (!metaInfo.usage) {
        metaInfo.usage = `${ctx.text('Usage')}: npm run cli ${argv.cliFullName} -- [options] [-h] [-v] [-t]`;
      }
      // welcomes
      metaInfo.welcomes = this._commandMeta_info_welcomes({ info });
      // ok
      return metaInfo;
    }

    _commandMeta_info_welcomes({ info }) {
      let welcomes = info.welcomes || [];
      if (!Array.isArray(welcomes)) welcomes = [welcomes];
      welcomes = welcomes.map(item => ctx.text(item));
      // helper doc
      const configHelper = this.cabloyConfig.cli && this.cabloyConfig.cli.helper;
      if (configHelper !== false) {
        let url = `https://cabloy.com/${ctx.locale === 'zh-cn' ? 'zh-cn/' : ''}articles/cli-introduce.html`;
        url = this.helper.chalk.keyword('cyan')(url);
        const text = `${ctx.text('CliDocs')}: ${url}`;
        welcomes.unshift(text);
      }
      return welcomes;
    }
  }
  return CliBase;
};


/***/ }),

/***/ 892:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    constructor(cli) {
      this.cli = cli;
    }

    get options() {
      return this.cli.options;
    }

    get context() {
      return this.cli.options.context;
    }

    async log(data, options = {}) {
      if (!data) return;
      // data
      if (typeof data !== 'object') {
        data = { text: String(data) };
      }
      let { progressNo, total, progress, text } = data;
      // logPrefix
      const logPrefix = options.logPrefix;
      if (logPrefix) {
        text = this._adjustText(logPrefix, text);
      }
      // update
      return await ctx.bean.progress.update({
        progressId: this.options.progressId,
        progressNo,
        total,
        progress,
        text,
      });
    }

    _adjustText(prefix, text) {
      return String(text)
        .split('\n')
        .map(item => (item ? prefix + item : item))
        .join('\n');
    }
  }
  return Local;
};


/***/ }),

/***/ 399:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { spawn } = __webpack_require__(81);
const path = __webpack_require__(17);
const require3 = __webpack_require__(638);
const Chalk = require3('chalk');
const TableClass = require3('cli-table3');
const Boxen = require3('boxen');
const fse = require3('fs-extra');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    constructor(cli) {
      this.cli = cli;
    }

    get options() {
      return this.cli.options;
    }

    get context() {
      return this.cli.options.context;
    }

    get console() {
      return this.cli.console;
    }

    get template() {
      return this.cli.template;
    }

    get moduleConfig() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    get chalk() {
      return this.newChalk();
    }
    get Table() {
      return TableClass;
    }
    newChalk(options) {
      if (!options) {
        options = this.moduleConfig.helper.chalk.options;
      }
      return new Chalk.Instance(options);
    }
    newTable(options) {
      return new TableClass(options);
    }
    boxen({ text, options }) {
      if (!options) {
        options = this.moduleConfig.helper.boxen.options;
      }
      return Boxen(text, options);
    }
    parseModuleInfo(moduleName) {
      const moduleInfo = mparse.parseInfo(moduleName);
      if (!moduleInfo) throw new Error(`module name is not valid: ${moduleName}`);
      return moduleInfo;
    }
    findModule(moduleName) {
      const moduleInfo = this.parseModuleInfo(moduleName);
      return ctx.app.meta.modules[moduleInfo.relativeName];
    }
    parseSuiteInfo(suiteName) {
      const suiteInfo = mparse.parseInfo(suiteName, 'suite');
      if (!suiteInfo) throw new Error(`suite name is not valid: ${suiteName}`);
      return suiteInfo;
    }
    findSuite(suiteName) {
      const suiteInfo = this.parseSuiteInfo(suiteName);
      return ctx.app.meta.suites[suiteInfo.relativeName];
    }
    async ensureDir(dir) {
      await fse.ensureDir(dir);
      return dir;
    }
    getNpmRegistry() {
      let registry = this.context.env.npm_config_registry;
      if (!registry) {
        const locale = ctx.locale === 'zh-cn' ? 'zh-cn' : 'en-us';
        registry = this.moduleConfig.helper.lerna.registry.locales[locale];
      }
      return registry;
    }
    async lernaBootstrap() {
      // args
      const args = ['bootstrap'];
      // registry
      const registry = this.getNpmRegistry();
      const registryOption = registry ? `--registry=${registry}` : '';
      if (registryOption) {
        args.push(registryOption);
      }
      // log
      await this.console.log(`===> lerna bootstrap ${registryOption}`);
      // spawn
      await this.spawnCmd({
        cmd: 'lerna',
        args,
      });
    }
    async formatFile({ fileName, logPrefix }) {
      try {
        await this.spawnBin({
          cmd: 'prettier',
          args: ['--write', fileName],
          options: {
            logPrefix,
          },
        });
      } catch (err) {
        if (err.code === 2) {
          // not throw error
          return;
        }
        throw err;
      }
    }
    async spawnBin({ cmd, args, options }) {
      cmd = path.join(this.context.cwd, 'node_modules/.bin', cmd);
      return await this.spawnCmd({ cmd, args, options });
    }
    async spawnCmd({ cmd, args, options }) {
      if (/^win/.test(process.platform)) {
        cmd = `${cmd}.cmd`;
      }
      return await this.spawn({ cmd, args, options });
    }
    async spawnExe({ cmd, args, options }) {
      if (/^win/.test(process.platform)) {
        cmd = `${cmd}.exe`;
      }
      return await this.spawn({ cmd, args, options });
    }
    async spawn({ cmd, args = [], options = {} }) {
      if (!options.cwd) {
        options.cwd = this.context.cwd;
      }
      return new Promise((resolve, reject) => {
        const logPrefix = options.logPrefix;
        const proc = spawn(cmd, args, options);
        proc.stdout.on('data', async data => {
          await this.console.log({ text: data.toString() }, { logPrefix });
        });
        proc.stderr.on('data', async data => {
          await this.console.log({ text: data.toString() }, { logPrefix });
        });
        proc.once('exit', code => {
          if (code !== 0) {
            const err = new Error(`spawn ${cmd} ${args.join(' ')} fail, exit code: ${code}`);
            err.code = code;
            return reject(err);
          }
          resolve();
        });
      });
    }
  }
  return Local;
};


/***/ }),

/***/ 573:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const fs = __webpack_require__(147);
const path = __webpack_require__(17);
const require3 = __webpack_require__(638);
const eggBornUtils = require3('egg-born-utils');
const isTextOrBinary = require3('istextorbinary');
const ejs = require3('@zhennann/ejs');
const gogocode = require3('gogocode');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    constructor(cli) {
      this.cli = cli;
    }

    get options() {
      return this.cli.options;
    }

    get context() {
      return this.cli.options.context;
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

    resolvePath({ moduleName, path: _path }) {
      const module = this.helper.findModule(moduleName);
      return path.join(module.root, 'backend/cli/templates', _path);
    }

    async renderBoilerplateAndSnippets({ targetDir, moduleName, snippetsPath, boilerplatePath }) {
      // first
      if (snippetsPath) {
        const snippetsDir = this.resolvePath({
          moduleName,
          path: snippetsPath,
        });
        await this.applySnippets({ targetDir, snippetsDir });
      }
      // then
      if (boilerplatePath) {
        const templateDir = this.resolvePath({
          moduleName,
          path: boilerplatePath,
        });
        await this.renderDir({ targetDir, templateDir });
      }
    }

    async renderDir({ targetDir, templateDir }) {
      const { argv } = this.context;
      // files
      const files = eggBornUtils.tools.globbySync('**/*', {
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
        const parentPath = path.join(targetDir, dirname);
        const targetFile = path.join(parentPath, ctx.bean.util.replaceTemplate(fileName, argv));
        await this.renderFile({ targetFile, templateFile });
        if (fileName !== '.gitkeep') {
          const gitkeep = path.join(parentPath, '.gitkeep');
          if (fs.existsSync(gitkeep)) {
            fs.unlinkSync(gitkeep);
          }
        }
      }
      return files;
    }

    async renderFile({ targetFile, templateFile }) {
      const stats = fs.lstatSync(templateFile);
      if (stats.isSymbolicLink()) {
        const target = fs.readlinkSync(templateFile);
        fs.symlinkSync(target, targetFile);
        await this.console.log(`${targetFile} link to ${target}`);
      } else if (stats.isDirectory()) {
        await this.helper.ensureDir(targetFile);
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
          result = await this.renderContent({ content });
          changed = content !== result;
        }
        // save
        fs.writeFileSync(targetFile, result);
        // format
        if (changed) {
          await this.helper.formatFile({ fileName: targetFile, logPrefix: 'format: ' });
        }
      } else {
        await this.console.log(`ignore ${templateFile}, only support file, dir, symlink`);
      }
    }

    async renderContent({ content }) {
      const data = this.getEjsData();
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

    getEjsData() {
      return {
        ...this.context,
        ctx,
      };
    }

    getAstData(ast, snippet) {
      return {
        cli: this.cli,
        ast,
        snippet,
        ...this.context,
        ctx,
      };
    }

    async applySnippets({ targetDir, snippetsDir }) {
      // snippets
      let files = eggBornUtils.tools.globbySync('*.js', {
        cwd: snippetsDir,
        onlyFiles: true,
      });
      // snippets sort
      files = files
        .filter(item => item[0] !== '-')
        .sort((a, b) => this._parseSnippetFilePrefix(a) - this._parseSnippetFilePrefix(b));
      // for
      for (const file of files) {
        const snippet = require3(path.join(snippetsDir, file));
        const targetFile = path.join(targetDir, snippet.file);
        await this.applySnippet({ targetFile, snippet });
      }
    }

    async applySnippet({ targetFile, snippet }) {
      await this.console.log(`apply changes to ${targetFile}`);
      // source code
      let sourceCode = fs.readFileSync(targetFile);
      sourceCode = sourceCode.toString('utf8');
      // language
      const language = snippet.parseOptions && snippet.parseOptions.language;
      // transform
      let outputCode;
      if (language === 'plain') {
        const ast = sourceCode;
        const outAst = await snippet.transform(this.getAstData(ast, snippet));
        outputCode = outAst;
      } else if (language === 'json') {
        const ast = JSON.parse(sourceCode);
        const outAst = await snippet.transform(this.getAstData(ast, snippet));
        outputCode = JSON.stringify(outAst, null, 2);
      } else {
        const ast = gogocode(sourceCode, { parseOptions: snippet.parseOptions });
        const outAst = await snippet.transform(this.getAstData(ast, snippet));
        outputCode = outAst.root().generate();
      }
      // save
      fs.writeFileSync(targetFile, outputCode);
      // format
      await this.helper.formatFile({ fileName: targetFile, logPrefix: 'format: ' });
    }

    _parseSnippetFilePrefix(fileName) {
      const num = fileName.split('-')[0];
      if (!num || isNaN(num)) return 10000;
      return parseInt(num);
    }
  }
  return Local;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {}

    async init(options) {}

    async test() {}
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const localConsole = __webpack_require__(892);
const localHelper = __webpack_require__(399);
const localTemplate = __webpack_require__(573);
const beanCliBase = __webpack_require__(778);
const beanCli = __webpack_require__(235);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.helper': {
      mode: 'ctx',
      bean: localHelper,
    },
    'local.template': {
      mode: 'ctx',
      bean: localTemplate,
    },
    'local.console': {
      mode: 'ctx',
      bean: localConsole,
    },
    // global
    cliBase: {
      mode: 'ctx',
      bean: beanCliBase,
      global: true,
    },
    cli: {
      mode: 'ctx',
      bean: beanCli,
      global: true,
    },
  };
  return beans;
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {
    helper: {
      chalk: {
        options: { level: 2 },
      },
      boxen: {
        options: { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' },
      },
      lerna: {
        registry: {
          locales: {
            'en-us': null,
            'zh-cn': 'https://registry.npmmirror.com',
          },
        },
      },
    },
    template: {
      render: {
        fileMapping: {
          gitignore: '.gitignore',
          _gitignore: '.gitignore',
          '_.gitignore': '.gitignore',
          '_package.json': 'package.json',
          '_.eslintrc': '.eslintrc',
          '_.eslintignore': '.eslintignore',
          '_.npmignore': '.npmignore',
          '_.eslintrc.js': '.eslintrc.js',
          '_jsconfig.json': 'jsconfig.json',
        },
        ignore: ['.DS_Store'],
      },
    },
  };
  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  CliDocs: 'Cli Docs',
  CliDone: 'Done',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  Usage: '用法',
  CliDocs: 'Cli文档',
  CliDone: '已完成',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ }),

/***/ 822:
/***/ ((module) => {

module.exports = app => {
  class cliController extends app.Controller {
    async meta() {
      const res = await this.ctx.service.cli.meta({
        context: this.ctx.request.body.context,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async execute() {
      const res = await this.ctx.service.cli.execute({
        progressId: this.ctx.request.body.progressId,
        context: this.ctx.request.body.context,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }

  return cliController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const cli = __webpack_require__(822);

module.exports = app => {
  const controllers = {
    cli,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);
const CliBaseFn = __webpack_require__(778);

module.exports = app => {
  // base
  app.meta.CliBase = CliBaseFn;

  // aops
  const aops = __webpack_require__(224)(app);
  // beans
  const beans = __webpack_require__(187)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // services
  const services = __webpack_require__(214)(app);
  // models
  const models = __webpack_require__(230)(app);
  // meta
  const meta = __webpack_require__(458)(app);

  return {
    aops,
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta,
  };
};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const schemas = __webpack_require__(232)(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
  };
  return meta;
};


/***/ }),

/***/ 230:
/***/ ((module) => {

module.exports = app => {
  const models = {};
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // cli
    {
      method: 'post',
      path: 'cli/meta',
      controller: 'cli',
      meta: { right: { enableAuthOpen: true } },
    },
    {
      method: 'post',
      path: 'cli/execute',
      controller: 'cli',
      meta: { right: { enableAuthOpen: true } },
    },
  ];
  return routes;
};


/***/ }),

/***/ 249:
/***/ ((module) => {

module.exports = app => {
  class cli extends app.Service {
    async meta({ context, user }) {
      return await this.ctx.bean.cli.meta({ context, user });
    }

    async execute({ progressId, context, user }) {
      return await this.ctx.bean.cli.execute({ progressId, context, user });
    }
  }

  return cli;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const cli = __webpack_require__(249);

module.exports = app => {
  const services = {
    cli,
  };
  return services;
};


/***/ }),

/***/ 638:
/***/ ((module) => {

"use strict";
module.exports = require("require3");

/***/ }),

/***/ 81:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(421);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map