const require3 = require('require3');
const uuid = require3('uuid');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Share {

    get modelShare() {
      return ctx.model.module(moduleInfo.relativeName).share;
    }

    get modelShareRecordPV() {
      return ctx.model.module(moduleInfo.relativeName).shareRecordPV;
    }

    get modelShareRecordUV() {
      return ctx.model.module(moduleInfo.relativeName).shareRecordUV;
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
      const link = this._combine_shareLink(item.uuid);
      // ok
      return { link };
    }

    async shareGo({ uuid, user }) {
      const userId = user.id;
      // get share
      const item = await this.modelShare.get({ uuid });
      if (!item) ctx.throw(404);
      // anonymous
      if (user.anonymous) {
        // redirect to login
        const shareLink = this._combine_shareLink(uuid);
        const url = ctx.bean.base.getAbsoluteUrl(`/#!${shareLink}`);
        ctx.redirect(url);
        return;
      }
      // not self
      if (item.userId !== userId) {
        await this._share_record({ item, userId });
      }
      // redirect to original url
      const url = ctx.bean.base.getAbsoluteUrl(`/#!${item.url}`);
      // redirect
      ctx.redirect(url);
    }

    _combine_shareLink(uuid) {
      return ctx.bean.base.getAbsoluteUrl(`/api/a/share/go/${uuid}`);
    }

    async _share_record({ item, userId }) {
      // aShareRecordPV
      await this.modelShareRecordPV.insert({
        shareId: item.id,
        userId,
      });
      // aShareRecordUV
      const uvData = {
        atomId: item.atomId,
        userIdSource: item.userId,
        userIdTarget: userId,
      };
      const uv = await this.modelShareRecordUV.get(uvData);
      if (!uv) {
        await this.modelShareRecordUV.insert(uvData);
      }
    }

  }

  return Share;
};
