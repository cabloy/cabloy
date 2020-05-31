const require3 = require('require3');
const uuid = require3('uuid');

const modelProgressFn = require('../../../model/progress.js');

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Progress {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._modelProgress = null;
    }

    // other module's progress
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get modelProgress() {
      if (!this._modelProgress) this._modelProgress = new (modelProgressFn(ctx.app))(ctx);
      return this._modelProgress;
    }

    async create() {
      const progressId = uuid.v4().replace(/-/g, '');
      await this.modelProgress.insert({ progressId, userId: ctx.user.op.id });
      return progressId;
    }

    async update({ progressId, progressNo = 0, total, progress, text }) {
      const item = await this.modelProgress.get({ progressId });
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
      const data = item.data ? JSON.parse(item.data) : [];
      if (data.length > progressNo + 1) {
        data.splice(progressNo + 1, data.length - progressNo - 1);
      }
      data[progressNo] = { total, progress, text };
      // update
      await this.modelProgress.update({ id: item.id, counter: item.counter + 1, data: JSON.stringify(data) });
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
      const item = await this.modelProgress.get({ progressId });
      if (!item) {
        // same as abort
        // 1001: 'Operation Aborted',
        ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // data
      const data = { message };
      // update
      await this.modelProgress.update({ id: item.id, counter: item.counter + 1, done: 1, data: JSON.stringify(data) });
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
      const item = await this.modelProgress.get({ progressId });
      if (!item) {
        // same as abort
        // 1001: 'Operation Aborted',
        ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // data
      const data = { message };
      // update
      await this.modelProgress.update({ id: item.id, counter: item.counter + 1, done: -1, data: JSON.stringify(data) });
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

    async _publish({ progressId, ioMessage }) {
      await ctx.performAction({
        method: 'post',
        url: '/a/socketio/publish',
        body: {
          path: `/a/progress/update/${progressId}`,
          message: ioMessage,
          messageClass: {
            module: moduleInfo.relativeName,
            messageClassName: 'progress',
          },
          user: { id: 0 },
        },
      });
    }

  }
  return Progress;
};
