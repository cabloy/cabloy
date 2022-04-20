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
      return meta;
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
