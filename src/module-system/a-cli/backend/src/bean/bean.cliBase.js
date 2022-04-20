module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CliBase extends app.meta.BeanBase {}
  return CliBase;
};
