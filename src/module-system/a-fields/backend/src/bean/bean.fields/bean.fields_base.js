// const moduleInfo = module.info;
module.exports = class Fields {
  get modelRoleFieldsRight() {
    return ctx.model.module('a-base').roleFieldsRight;
  }
};
