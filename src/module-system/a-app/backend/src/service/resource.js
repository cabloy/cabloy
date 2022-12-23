module.exports = app => {
  class Resource extends app.Service {
    async read({ atomStaticKey, options, user }) {
      // donot check user access right
      return await this.ctx.bean.resource.readByStaticKey({ atomStaticKey, options /* , user*/ });
    }
  }

  return Resource;
};
