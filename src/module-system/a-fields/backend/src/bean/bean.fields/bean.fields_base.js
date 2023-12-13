module.exports = ctx => {
  // const moduleInfo = module.info;
  class Fields {
    get modelRoleFieldsRight() {
      return ctx.model.module('a-base').roleFieldsRight;
    }
  }

  return Fields;
};
