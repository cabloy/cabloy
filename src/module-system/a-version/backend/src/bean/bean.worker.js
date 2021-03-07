module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Worker extends app.meta.BeanBase {

    get id() {
      return app.meta.workerId;
    }

    async setAlive() {
      const config = app.meta.configs[moduleInfo.relativeName];
      const aliveTimeout = config.worker.alive.timeout;
      const key = `workerAlive:${this.id}`;
      const redis = app.redis.get('cache');
      await redis.set(key, JSON.stringify(true), 'PX', aliveTimeout * 2);
    }

    async getAlive({ id }) {
      const key = `workerAlive:${id}`;
      const redis = app.redis.get('cache');
      const value = await redis.get(key);
      return value ? JSON.parse(value) : undefined;
    }

  }

  return Worker;
};
