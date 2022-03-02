module.exports = app => {
  class SessionStore extends app.meta.BeanBase {
    async get(key) {
      // const res = await redis.get(key);
      // if (!res) return null;
      // return JSON.parse(res);
    }

    async set(key, value, maxAge) {
      // maxAge = typeof maxAge === 'number' ? maxAge : ONE_DAY;
      // value = JSON.stringify(value);
      // await redis.set(key, value, 'PX', maxAge);
    }

    async destroy(key) {
      // await redis.del(key);
    }
  }

  return SessionStore;
};
