module.exports = ctx => {
  const moduleInfo = module.info;
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
        host,
        atomId,
        url,
        userId,
      });
      // insert
      if (!item) {
        item = {
          uuid: ctx.bean.util.uuidv4(),
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
      return { link, uuid: item.uuid };
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
        await this._share_record({ item, user });
      }
      // redirect to original url
      const url = item.url.indexOf('http') === 0 ? item.url : ctx.bean.base.getAbsoluteUrl(`/#!${item.url}`);
      // redirect
      ctx.redirect(url);
    }

    _combine_shareLink(uuid) {
      return ctx.bean.base.getAbsoluteUrl(`/api/a/share/go/${uuid}`);
    }

    async _share_record({ item, user }) {
      const userId = user.id;
      // aShareRecordPV
      await ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'shareRecordPV',
        data: { share: item, user },
        next: async (context, next) => {
          // record
          const res = await this.modelShareRecordPV.insert({
            shareId: item.id,
            userId,
          });
          context.result = {
            recordId: res.insertId,
          };
          // next
          await next();
        },
      });
      // aShareRecordUV
      const uvData = {
        atomId: item.atomId,
        userIdSource: item.userId,
        userIdTarget: userId,
      };
      const uv = await this.modelShareRecordUV.get(uvData);
      if (!uv) {
        await ctx.bean.event.invoke({
          module: moduleInfo.relativeName,
          name: 'shareRecordUV',
          data: { share: item, user },
          next: async (context, next) => {
            // record
            const res = await this.modelShareRecordUV.insert(uvData);
            context.result = {
              recordId: res.insertId,
            };
            // next
            await next();
          },
        });
      }
    }
  }

  return Share;
};
