module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute() {
      const aliveTimeout = this.ctx.config.worker.alive.timeout;
      // interval
      setInterval(async () => {
        await app.bean.worker.setAlive();
      }, aliveTimeout);
      // alive
      await app.bean.worker.setAlive();
    }
  }

  return Startup;
};
