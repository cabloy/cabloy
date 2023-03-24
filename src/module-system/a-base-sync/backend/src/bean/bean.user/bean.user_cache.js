module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class User {
    async getCacheUsers({ userIds }) {
      return await ctx.bean.summer.mget(
        {
          module: moduleInfo.relativeName,
          name: 'userInfo',
        },
        userIds
      );
    }

    async getCacheUser({ userId }) {
      return await ctx.bean.summer.get(
        {
          module: moduleInfo.relativeName,
          name: 'userInfo',
        },
        userId
      );
    }

    async deleteCacheUser({ userId }) {
      return await ctx.bean.summer.del(
        {
          module: moduleInfo.relativeName,
          name: 'userInfo',
        },
        userId
      );
    }
  }
  return User;
};
