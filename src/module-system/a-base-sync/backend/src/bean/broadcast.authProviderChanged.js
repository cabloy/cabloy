module.exports = ctx => {
  class Broadcast {

    async execute(context) {
      const data = context.data;
      await ctx.bean.auth._registerInstanceProvider(ctx.subdomain, ctx.instance.id, data.module, data.providerName);
    }

  }

  return Broadcast;
};
