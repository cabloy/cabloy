module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class User {
    async getCacheUsers({ userIds }) {
      const cache = this.__getCacheUserInfo();
      return await cache.mget(userIds);
    }

    async getCacheUser({ userId }) {
      const cache = this.__getCacheUserInfo();
      return await cache.get(userId);
    }

    async deleteCacheUser({ userId }) {
      const cache = this.__getCacheUserInfo();
      return await cache.del(userId);
    }

    __getCacheUserInfo() {
      return ctx.bean.summer.getCache({ module: moduleInfo.relativeName, name: 'userInfo' });
    }
  }
  return User;
};
