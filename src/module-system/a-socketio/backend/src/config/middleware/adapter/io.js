// const modelMailFn = require('../../../model/mail.js');

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IO {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      // this._modelMail = null;
      this._redis = null;
    }

    // other module's io
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    // get modelMail() {
    //   if (!this._modelMail) this._modelMail = new (modelMailFn(ctx.app))(ctx);
    //   return this._modelMail;
    // }

    get clientId() {
      return ctx.user.op.anonymous ? ctx.meta.user.anonymousId() : ctx.user.op.id;
    }

    get redis() {
      if (!this._redis) this._redis = ctx.app.redis.get('io') || ctx.app.redis.get('cache');
      return this._redis;
    }

    // subcribe
    //    hash key: clientId:path
    //    hash value: scene -> workerId:socketId
    async subscribe({ subscribes, socketId, clientId }) {
      for (const item of subscribes) {
        const path = item.path;
        const scene = item.scene || '';
        const key = `${clientId}:${path}`;
        const value = `${ctx.app.meta.workerId}:${socketId}`;
        await this.redis.hset(key, scene, value);
      }
    }

    async unsubscribe({ subscribes, clientId }) {
      for (const item of subscribes) {
        const path = item.path;
        const scene = item.scene || '';
        const key = `${clientId}:${path}`;
        await this.redis.hdel(key, scene);
      }
    }

  }
  return IO;
};
