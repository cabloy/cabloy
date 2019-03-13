const require3 = require('require3');
const mparse = require3('egg-born-mparse').default;

module.exports = app => {
  // this module
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  // article module
  const articleModuleInfo = mparse.parseInfo('a-cms');
  const articleAtomClassName = 'article';

  class Post extends app.Service {

    async create({ atomClass, key, item, user }) {
      // route to article
      const itemKey = await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/create`,
        body: {
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
          atomClass,
          options,
          items,
          user,
        },
      });
    }

    async write({ atomClass, key, item, validation, user }) {
      // route to article
      await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/write`,
        body: {
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
          atomClass,
          key,
          user,
        },
      });
    }

    async action({ action, atomClass, key, user }) {
      // switch sticky
      if (action === 102) {
        const sql = `update aCmsArticle set sticky=if(sticky=1,0,1)
                       where iid=? and id=?`;
        await this.ctx.model.query(sql, [ this.ctx.instance.id, key.itemId ]);
      }
      // route to article
      return await this.ctx.performAction({
        method: 'post',
        url: `/${articleModuleInfo.url}/${articleAtomClassName}/action`,
        body: {
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
