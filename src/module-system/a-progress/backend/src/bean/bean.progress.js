module.exports = ctx => {
  const moduleInfo = module.info;
  class Progress extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'progress');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }

    get redis() {
      if (!this._redis) this._redis = ctx.app.redis.get('io') || ctx.app.redis.get('cache');
      return this._redis;
    }

    _getRedisKey({ progressId }) {
      return `progress:${ctx.instance.id}:${progressId}`;
    }

    async _getRedisValue({ progressId }) {
      const key = this._getRedisKey({ progressId });
      const content = await this.redis.get(key);
      return content ? JSON.parse(content) : null;
    }

    async _setRedisValue({ progressId, content, contentOld }) {
      const expireTime = this.configModule.progress.expireTime;
      const key = this._getRedisKey({ progressId });
      if (contentOld) {
        content = Object.assign({}, contentOld, content);
      }
      await this.redis.set(key, JSON.stringify(content), 'PX', expireTime);
    }

    async _updateRedisValue({ progressId, content }) {
      const contentOld = await this._getRedisValue({ progressId });
      await this._setRedisValue({ progressId, content, contentOld });
    }

    async _deleteRedisValue({ progressId }) {
      const key = this._getRedisKey({ progressId });
      await this.redis.del(key);
    }

    async create(options) {
      if (!ctx.state.user || !ctx.state.user.op) return ctx.throw(403);
      let progressId = options && options.progressId;
      // create
      if (!progressId) {
        progressId = ctx.bean.util.uuidv4();
      } else {
        // check if exists
        const item = await this._getRedisValue({ progressId });
        if (item) return ctx.throw(403);
      }
      // redis
      await this._setRedisValue({
        progressId,
        content: {
          userId: ctx.state.user.op.id,
          counter: 0,
          done: 0,
          abort: 0,
          data: null,
        },
      });
      // ok
      return progressId;
    }

    async update({ progressId, progressNo = 0, total, progress, text }) {
      if (!progressId) return;
      const item = await this._getRedisValue({ progressId });
      if (!item) {
        // same as abort
        // 1001: 'Operation Aborted',
        ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // abort
      if (item.abort) {
        // 1001: 'Operation Aborted',
        ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // data
      const data = item.data || [];
      if (data.length > progressNo + 1) {
        data.splice(progressNo + 1, data.length - progressNo - 1);
      }
      data[progressNo] = { total, progress, text };
      // update
      await this._setRedisValue({
        progressId,
        content: {
          counter: item.counter + 1,
          data,
        },
        contentOld: item,
      });
      // publish
      const ioMessage = {
        userIdTo: item.userId,
        content: {
          ...item,
          counter: item.counter + 1,
          data,
        },
      };
      await this._publish({ progressId, ioMessage });
    }

    async done({ progressId, message }) {
      if (!progressId) return;
      const item = await this._getRedisValue({ progressId });
      if (!item) {
        // same as abort
        // 1001: 'Operation Aborted',
        ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // data
      const data = { message };
      // update
      await this._setRedisValue({
        progressId,
        content: {
          counter: item.counter + 1,
          done: 1,
          data,
        },
        contentOld: item,
      });
      // publish
      const ioMessage = {
        userIdTo: item.userId,
        content: {
          ...item,
          counter: item.counter + 1,
          done: 1,
          data,
        },
      };
      await this._publish({ progressId, ioMessage });
    }

    async error({ progressId, message }) {
      if (!progressId) return;
      const item = await this._getRedisValue({ progressId });
      if (!item) {
        // same as abort
        // 1001: 'Operation Aborted',
        ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // data
      const data = { message };
      // update
      await this._setRedisValue({
        progressId,
        content: {
          counter: item.counter + 1,
          done: -1,
          data,
        },
        contentOld: item,
      });
      // publish
      const ioMessage = {
        userIdTo: item.userId,
        content: {
          ...item,
          counter: item.counter + 1,
          done: -1,
          data,
        },
      };
      await this._publish({ progressId, ioMessage });
    }

    async check({ progressId, counter, user }) {
      if (!progressId) return null;
      const item = await this._getRedisValue({ progressId });
      if (!item || item.userId !== user.id || item.counter <= counter) return null;
      return item;
    }

    async abort({ progressId, user }) {
      if (!progressId) return;
      const item = await this._getRedisValue({ progressId });
      if (!item || item.userId !== user.id) return;
      await this._setRedisValue({
        progressId,
        content: {
          abort: 1,
        },
        contentOld: item,
      });
    }

    async delete({ progressId, user }) {
      if (!progressId) return;
      const item = await this._getRedisValue({ progressId });
      if (!item || item.userId !== user.id) return;
      await this._deleteRedisValue({ progressId });
    }

    async _publish({ progressId, ioMessage }) {
      await ctx.bean.io.publish({
        path: `/a/progress/update/${progressId}`,
        message: ioMessage,
        messageClass: {
          module: moduleInfo.relativeName,
          messageClassName: 'progress',
        },
      });
    }
  }
  return Progress;
};
