module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CliBase {
    async meta({ argv, user }) {
      return {
        locale: ctx.locale,
      };
    }
  }
  return CliBase;
};
