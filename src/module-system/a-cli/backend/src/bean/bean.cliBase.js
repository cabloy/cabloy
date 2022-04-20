module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CliBase extends app.meta.BeanBase {
    async meta({ argv, user }) {
      return {
        ok: 1,
      };
    }
  }
  return CliBase;
};
