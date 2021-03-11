module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class DetailBase extends app.meta.BeanBase {

  }
  return DetailBase;
};
