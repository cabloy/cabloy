// const moduleInfo = module.info;
module.exports = class Fields {
  get modelRoleFieldsRight() {
    return this.ctx.model.module('a-base').roleFieldsRight;
  }
};
