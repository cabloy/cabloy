module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {
    async execute(context) {
      const { keys, user } = context;
      if (keys.length === 2) {
        // messageClass
        const [module, messageClassName] = keys[1].split('_');
        const messageClass = { module, messageClassName };
        const messageClassBase = ctx.bean.io.messageClass.messageClass(messageClass);
        // options
        const options = {
          where: {
            messageRead: 0,
          },
        };
        // count
        const res = await ctx.bean.io.message.count({ messageClass, options, user });
        const count = res.count;
        // stat
        const color = messageClassBase.info.uniform.stats.color;
        return { [color]: count };
      } else if (keys.length === 1) {
        // message
        const modelStats = ctx.model.module('a-stats').stats;
        const items = await modelStats.select({
          where: {
            module: moduleInfo.relativeName,
            name: {
              op: 'likeRight',
              val: 'message.',
            },
            userId: user.id,
          },
        });
        // count
        const stat = {
          red: 0,
          gray: 0,
        };
        for (const item of items) {
          // only level 2
          if (item.name.split('.').length !== 2) continue;
          const value = JSON.parse(item.value);
          if (value && value.red !== undefined) stat.red += value.red;
          if (value && value.gray !== undefined) stat.gray += value.gray;
        }
        // ok
        return stat;
      }
    }
  }

  return Stats;
};
