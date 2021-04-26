const require3 = require('require3');
const uuid = require3('uuid');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Share {

    get modelShare() {
      return ctx.model.module(moduleInfo.relativeName).share;
    }

    async generate({ host, atomId, url, user }) {
      const userId = user.id;
      // get
      let item = await this.modelShare.get({
        host, atomId, url, userId,
      });
      // insert
      if (!item) {
        item = {
          uuid: uuid.v4().replace(/-/g, ''),
          atomId,
          userId,
          host,
          url,
        };
        const res = await this.modelShare.insert(item);
        item.id = res.insertId;
      }
      // link
      const link = ctx.bean.base.getAbsoluteUrl(`/api/a/share/go/${item.uuid}`);
      // ok
      return { link };
    }

    async shareGo({ uuid, user }) {
      const userId = user.id;
      // get
      const item = await this.modelShare.get({ uuid });
      if (!item) ctx.throw(404);
      // url
      const url = ctx.bean.base.getAbsoluteUrl(`/#!${item.url}`);
      // redirect
      ctx.redirect(url);
    }

  }

  return Share;
};
