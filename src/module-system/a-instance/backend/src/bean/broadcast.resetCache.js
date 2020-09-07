module.exports = ctx => {
  class Broadcast {

    async execute() {
      await ctx.bean.instance.resetCache({ subdomain: ctx.subdomain });
    }

  }

  return Broadcast;
};
