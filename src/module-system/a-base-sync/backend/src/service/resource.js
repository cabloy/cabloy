module.exports = app => {

  class Resource extends app.Service {

    async select({ options, user }) {
      return await this.ctx.bean.resource.select({ options, user });
    }

    async check({ atomStaticKeys, user }) {
      return await this.ctx.bean.resource.check({ atomStaticKeys, user });
    }

  }

  return Resource;
};
