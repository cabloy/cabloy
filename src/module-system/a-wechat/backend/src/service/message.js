module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Message extends app.Service {

    async index({ message }) {
      let res;
      // event: subscribe
      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          res = await this._subscribeUser({ openid: message.FromUserName, message });
        } else if (message.Event === 'unsubscribe') {
          res = await this._unsubscribeUser({ openid: message.FromUserName, message });
        }
      }
      // raise event
      const res2 = await this.ctx.meta.event.invoke({
        module: moduleInfo.relativeName,
        name: 'wechatMessage',
        data: { message },
      });
      if (res2) res = res2;
      // check if ready
      if (res) return res;
      // default reply
      return {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: this.ctx.config.account.public.message.reply.default,
      };
    }

    async _subscribeUser({ openid, message }) {
      // user info
      const userInfo = await this.ctx.meta.wechat.getUser({ openid });
      // ensure wechat user
      const userWechatId = await this._ensureWechatUser({ openid, userInfo });
      // ensure auth user
      const verifyUser = await this._ensureAuthUser({ openid, userInfo });
      // update wechat userId
      await this.ctx.model.wechatUser.update({ id: userWechatId, userId: verifyUser.agent.id });
      // ok
      return {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: this.ctx.config.account.public.message.reply.subscribe,
      };
    }

    async _unsubscribeUser({ openid, message }) {
      // wechat user
      const userWechat = await this.ctx.model.wechatUser.get({ openid });
      if (userWechat) {
        await this.ctx.model.wechatUser.update({
          id: userWechat.id, subscribe: 0,
        });
      }
      // ok
      return {
        ToUserName: message.FromUserName,
        FromUserName: message.ToUserName,
        CreateTime: new Date().getTime(),
        MsgType: 'text',
        Content: '',
      };
    }

    async _ensureWechatUser({ openid, userInfo }) {
      let userWechatId;
      // wechat user
      let userWechat = await this.ctx.model.wechatUser.get({ openid });
      const exists = !!userWechat;
      if (!userWechat) {
        userWechat = {};
      } else {
        userWechatId = userWechat.id;
        delete userWechat.createdAt;
        delete userWechat.updatedAt;
        delete userWechat.deleted;
        delete userWechat.iid;
        delete userWechat.userId;
      }
      // check fields
      let needUpdate = false;
      const fields = [ 'openid', 'unionid', 'nickname', 'subscribe', 'sex', 'language', 'city', 'province', 'country', 'headimgurl', 'subscribe_time', 'remark', 'groupid', 'subscribe_scene', 'qr_scene', 'qr_scene_str' ];
      for (const field of fields) {
        if (userInfo[field] === undefined || userInfo[field] === userWechat[field]) {
          delete userWechat[field];
        } else {
          userWechat[field] = userInfo[field];
          needUpdate = true;
        }
      }
      // update
      if (needUpdate) {
        if (!exists) {
          const res = await this.ctx.model.wechatUser.insert(userWechat);
          userWechatId = res.insertId;
        } else {
          await this.ctx.model.wechatUser.update(userWechat);
        }
      }
      // ok
      return userWechatId;
    }

    // profileId : unionid:openid
    async _ensureAuthUser({ openid, userInfo }) {
      const unionid = userInfo.unionid || '';
      const profileId = `${unionid}:${openid}`;
      const profileUser = {
        module: moduleInfo.relativeName,
        provider: 'wechat',
        profileId,
        profile: {
          id: profileId,
          userName: userInfo.nickname,
          realName: userInfo.nickname,
          avatar: userInfo.headimgurl,
          profile: userInfo,
        },
      };
      // provider
      const providerItem = await this.ctx.meta.user.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: 'wechat',
      });
      // check auth
      let authId;
      let authUserId;
      const authItem = await this.ctx.model.query(
        `select * from aAuth a where a.deleted=0 and a.iid=? and a.providerId=? and a.profileId like '%:${openid}'`,
        [ this.ctx.instance.id, providerItem.id ]
      );
      if (!authItem) {
        // insert auth
        const res = await this.ctx.model.auth.insert({
          providerId: providerItem.id,
          profileId,
          profile: JSON.stringify(profileUser.profile),
        });
        authId = res.insertId;
      } else {
        // always update
        await this.ctx.model.auth.update({
          id: authItem.id,
          profileId,
          profile: JSON.stringify(profileUser.profile),
        });
        authId = authItem.id;
        authUserId = authItem.userId;
      }
      // check if has userId for unionid
      if (unionid) {
        const _authOther = await this.ctx.model.query(
          `select * from aAuth a where a.deleted=0 and a.iid=? and a.profileId like '${unionid}:%' and a.id<>?`,
          [ this.ctx.instance.id, authId ]
        );
        if (_authOther && _authOther.userId !== authUserId) {
          // update userId for this auth
          await this.ctx.model.auth.update({ id: authId, userId: _authOther.userId });
        }
      }
      // verify
      return await this.ctx.meta.user.verify({ state: 'login', profileUser });
    }


  }

  return Message;
};
