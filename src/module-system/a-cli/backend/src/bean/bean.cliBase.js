const eggBornUtils = require('egg-born-utils');

module.exports = ctx => {
  const moduleInfo = module.info;
  class CliBase {
    constructor(options) {
      this.options = options;
      this.console = ctx.bean._newBean(`${moduleInfo.relativeName}.local.console`, this);
      this.helper = ctx.bean._newBean(`${moduleInfo.relativeName}.local.helper`, this);
      this.template = ctx.bean._newBean(`${moduleInfo.relativeName}.local.template`, this);
      this.cabloyConfig = null;
      this.terminal = options.terminal !== false;
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
      const configHelper = ctx.bean.util.getProperty(this.cabloyConfig.get(), 'cli.helper');
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
