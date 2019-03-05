const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = app => {
  const articleModuleInfo = mparse.parseInfo('a-cms');
  const articleAtomClassName = 'article';
  const cmsSite = 'community';
  class Post extends app.Service {

    async create({ atomClass, key, item, user }) {
      // route to article
      const itemKey = await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/create`,
        body: {
          cmsSite,
          atomClass,
          key,
          item,
          user,
        },
      });
      // return key
      return itemKey;
    }

    async read({ atomClass, key, item, user }) {
      // route to article
      await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/read`,
        body: {
          cmsSite,
          atomClass,
          key,
          item,
          user,
        },
      });
    }

    async select({ atomClass, options, items, user }) {
      // route to article
      await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/select`,
        body: {
          cmsSite,
          atomClass,
          options,
          items,
          user,
        },
      });
    }

    async write({ atomClass, key, item, validation, user }) {
      // init fields
      item.editMode = 1;
      // route to article
      await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/write`,
        body: {
          cmsSite,
          atomClass,
          key,
          item,
          validation,
          user,
        },
      });
    }

    async delete({ atomClass, key, user }) {
      // route to article
      await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/delete`,
        body: {
          cmsSite,
          atomClass,
          key,
          user,
        },
      });
    }

    async action({ action, atomClass, key, user }) {
      // route to article
      return await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/action`,
        body: {
          cmsSite,
          action,
          atomClass,
          key,
          user,
        },
      });
    }

    async enable({ atomClass, key, atom, user }) {
      // route to article
      await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/enable`,
        body: {
          cmsSite,
          atomClass,
          key,
          atom,
          user,
        },
      });
    }

  }

  return Post;
};
