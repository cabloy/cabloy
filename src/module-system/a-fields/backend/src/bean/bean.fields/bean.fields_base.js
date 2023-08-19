module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Fields {
    get modelRoleFieldsRight() {
      return ctx.model.module('a-base').roleFieldsRight;
    }
  }

  return Fields;
};
