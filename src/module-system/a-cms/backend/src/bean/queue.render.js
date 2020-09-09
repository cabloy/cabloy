const Build = require('../common/build.js');

module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const data = context.data;
      const queueAction = data.queueAction;
      return await this[queueAction](data);
    }

    async buildLanguage({ atomClass, language, progressId }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.buildLanguage({ language, progressId });
    }

    async buildLanguages({ atomClass, progressId }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.buildLanguages({ progressId });
    }

    async renderArticle({ atomClass, key, inner }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.renderArticle({ key, inner });
    }

    async deleteArticle({ atomClass, key, article, inner }) {
      const build = Build.create(this.ctx, atomClass);
      return await build.deleteArticle({ key, article, inner });
    }

  }

  return Queue;
};
