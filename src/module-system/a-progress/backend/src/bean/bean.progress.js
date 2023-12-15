const moduleInfo = module.info;
module.exports = class Progress extends module.meta.class.BeanModuleBase {
  get configModule() {
    return this.ctx.config.module(moduleInfo.relativeName);
  }

  get redis() {
    if (!this._redis) this._redis = this.ctx.app.redis.get('io') || this.ctx.app.redis.get('cache');
    return this._redis;
  }

  _getRedisKey({ progressId }) {
    return `progress:${this.ctx.instance.id}:${progressId}`;
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
    if (!this.ctx.state.user || !this.ctx.state.user.op) return this.ctx.throw(403);
    let progressId = options && options.progressId;
    // create
    if (!progressId) {
      progressId = this.ctx.bean.util.uuidv4();
    } else {
      // check if exists
      const item = await this._getRedisValue({ progressId });
      if (item) return this.ctx.throw(403);
    }
    // redis
    await this._setRedisValue({
      progressId,
      content: {
        userId: this.ctx.state.user.op.id,
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
      this.ctx.throw.module(moduleInfo.relativeName, 1001);
    }
    // abort
    if (item.abort) {
      // 1001: 'Operation Aborted',
      this.ctx.throw.module(moduleInfo.relativeName, 1001);
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
      this.ctx.throw.module(moduleInfo.relativeName, 1001);
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
      this.ctx.throw.module(moduleInfo.relativeName, 1001);
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
    await this.ctx.bean.io.publish({
      path: `/a/progress/update/${progressId}`,
      message: ioMessage,
      messageClass: {
        module: moduleInfo.relativeName,
        messageClassName: 'progress',
      },
    });
  }
};
