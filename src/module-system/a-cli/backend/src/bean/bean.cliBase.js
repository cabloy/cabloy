module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CliBase {
    async meta({ command, argv, user }) {
      const metaLocale = this._commandMeta({ command, argv });
      return metaLocale;
    }

    _commandMeta({ command, argv }) {
      const meta = {};
      meta.info = this._commandMeta_info({ info: command.info, argv });
      meta.options = this._commandMeta_options({ options: command.options, argv });
      return meta;
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
        metaInfo.usage = `${ctx.text('Usage')}: npm run ${argv.cliFullName} -- [options]`;
      }
      return metaInfo;
    }
  }
  return CliBase;
};
