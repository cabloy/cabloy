const eggBornUtils = require('egg-born-utils');

const moduleInfo = module.info;
module.exports = class CliBase {
  constructor(options) {
    this.options = options;
    this.cabloyConfig = null;
    this.terminal = options.terminal !== false;
  }

  get console() {
    if (!this.__console) {
      this.__console = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.console`, this);
    }
    return this.__console;
  }

  get helper() {
    if (!this.__helper) {
      this.__helper = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.helper`, this);
    }
    return this.__helper;
  }

  get template() {
    if (!this.__template) {
      this.__template = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.template`, this);
    }
    return this.__template;
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
      description: this.ctx.text(group.description),
      condition: group.condition,
      questions: {},
    };
    for (const key in group.questions) {
      const question = group.questions[key];
      metaGroup.questions[key] = {
        ...question,
        message: this.ctx.text(question.message),
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
          description: this.ctx.text(option.description),
        };
      }
    }
    return metaOptions;
  }

  _commandMeta_info({ info, argv }) {
    // info
    const metaInfo = {
      version: info.version,
      title: this.ctx.text(info.title),
      usage: this.ctx.text(info.usage),
    };
    // usage
    if (!metaInfo.usage) {
      metaInfo.usage = `${this.ctx.text('Usage')}: npm run cli ${argv.cliFullName} -- [options] [-h] [-v] [-t]`;
    }
    // welcomes
    metaInfo.welcomes = this._commandMeta_info_welcomes({ info });
    // ok
    return metaInfo;
  }

  _commandMeta_info_welcomes({ info }) {
    let welcomes = info.welcomes || [];
    if (!Array.isArray(welcomes)) welcomes = [welcomes];
    welcomes = welcomes.map(item => this.ctx.text(item));
    // helper doc
    const configHelper = this.ctx.bean.util.getProperty(this.cabloyConfig.get(), 'cli.helper');
    if (configHelper !== false) {
      let url = `https://cabloy.com/${this.ctx.locale === 'zh-cn' ? 'zh-cn/' : ''}articles/cli-introduce.html`;
      url = this.helper.chalk.keyword('cyan')(url);
      const text = `${this.ctx.text('CliDocs')}: ${url}`;
      welcomes.unshift(text);
    }
    return welcomes;
  }
};
