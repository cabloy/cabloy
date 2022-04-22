module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CliBase {
    get helper() {
      return ctx.bean.local.module(moduleInfo.relativeName).helper;
    }

    async meta({ command, context, user }) {
      const metaLocale = this._commandMeta({ command, context });
      return metaLocale;
    }

    async execute(/* { progressId, command, context, user }*/) {
      // do nothing
    }

    async log({ progressId, progressNo, total, progress, text }) {
      return await ctx.bean.progress.update({ progressId, progressNo, total, progress, text });
    }

    _commandMeta({ command, context }) {
      const { argv } = context;
      const meta = {};
      meta.info = this._commandMeta_info({ info: command.info, argv });
      meta.options = this._commandMeta_options({ options: command.options, argv });
      meta.groups = this._commandMeta_groups({ groups: command.groups, argv });
      return meta;
    }

    _commandMeta_groups({ groups }) {
      const metaGroups = {};
      for (const groupName in groups) {
        const group = groups[groupName];
        metaGroups[groupName] = this._commandMeta_group({ group });
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
      for (const key in options) {
        const option = options[key];
        metaOptions[key] = {
          ...option,
          description: ctx.text(option.description),
        };
      }
      return metaOptions;
    }

    _commandMeta_info({ info, argv }) {
      const metaInfo = {
        version: info.version,
        title: ctx.text(info.title),
        usage: ctx.text(info.usage),
      };
      if (!metaInfo.usage) {
        metaInfo.usage = `${ctx.text('Usage')}: npm run cli ${argv.cliFullName} -- [options] [-h] [-v]`;
      }
      return metaInfo;
    }
  }
  return CliBase;
};
