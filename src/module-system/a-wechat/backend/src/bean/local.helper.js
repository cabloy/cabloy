const require3 = require('require3');
const extend = require3('extend2');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    get modelWechatUser() {
      return ctx.model(moduleInfo.relativeName).wechatUser;
    }
    get modelAuth() {
      return ctx.model.module('a-base').auth;
    }

    async verifyAuthUser({ beanProvider, openid, userInfo, state, needLogin = false }) {
      // ensure wechat user
      const userWechatId = await this._ensureWechatUser({ beanProvider, openid, userInfo });
      // ensure auth user
      const profileUser = await this._ensureAuthUser({ beanProvider, openid, userInfo });
      // verify
      const verifyUser = await ctx.bean.user.verify({ state, profileUser });
      if (needLogin) {
        await ctx.login(verifyUser);
      }
      // update wechat userId
      await this._updateWechatUser({ userId: verifyUser.agent.id, userWechatId, userInfo });
      // ok
      return verifyUser;
    }

    async _ensureWechatUser({ beanProvider, openid, userInfo }) {
      let userWechatId;
      // wechat user
      let userWechat = await this.modelWechatUser.get({ openid });
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
      const fields = [
        'scene',
        'openid',
        'unionid',
        'nickname',
        'subscribe',
        'sex',
        'language',
        'city',
        'province',
        'country',
        'headimgurl',
        'subscribe_time',
        'remark',
        'groupid',
        'subscribe_scene',
        'qr_scene',
        'qr_scene_str',
      ];
      userInfo.scene = beanProvider.providerScene;
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
          const res = await this.modelWechatUser.insert(userWechat);
          userWechatId = res.insertId;
        } else {
          await this.modelWechatUser.update(userWechat);
        }
      }
      // ok
      return userWechatId;
    }

    async _updateWechatUser({ userId, userWechatId, userInfo }) {
      const unionid = userInfo.unionid || '';
      if (unionid) {
        // update all
        await ctx.model.query('update aWechatUser a set a.userId=? where a.deleted=0 and a.iid=? and a.unionid=?', [
          userId,
          ctx.instance.id,
          unionid,
        ]);
      } else {
        // update this
        await ctx.model.wechatUser.update({ id: userWechatId, userId });
      }
    }

    // profileId : unionid:openid
    //   1. force append unionid
    //   2. prepare auth record
    //   3. try to union user
    async _ensureAuthUser({ beanProvider, openid, userInfo }) {
      const unionid = userInfo.unionid || '';
      const profileId = `${unionid}:${openid}`;
      const profileUser = {
        module: beanProvider.providerModule,
        provider: beanProvider.providerName,
        providerScene: beanProvider.providerScene,
        profileId,
        profile: {
          userName: userInfo.nickname,
          realName: userInfo.nickname,
          avatar: userInfo.headimgurl,
          profile: userInfo,
        },
        autoActivate: this.configModule.auth.autoActivate,
      };
      // provider
      const { providerItem } = beanProvider.configProviderCache;
      // check auth
      let authId;
      let authUserId;
      const authItem = await ctx.model.queryOne(
        `select * from aAuth a where a.deleted=0 and a.iid=? and a.providerId=? and a.providerScene=? and a.profileId like '%:${openid}'`,
        [ctx.instance.id, providerItem.id, beanProvider.providerScene]
      );
      if (!authItem) {
        // always set avatar empty
        const _profile = extend(true, {}, profileUser.profile);
        delete _profile.avatar;
        // insert auth
        const res = await this.modelAuth.insert({
          providerId: providerItem.id,
          providerScene: beanProvider.providerScene,
          profileId,
          profile: JSON.stringify(_profile),
        });
        authId = res.insertId;
      } else {
        // hold old avatar empty
        const _profile = extend(true, {}, profileUser.profile);
        const _profileOld = JSON.parse(authItem.profile);
        _profile.avatar = _profileOld.avatar;
        // always update
        await this.modelAuth.update({
          id: authItem.id,
          profileId,
          profile: JSON.stringify(_profile),
        });
        authId = authItem.id;
        authUserId = authItem.userId;
      }
      // check if has userId for unionid
      if (unionid) {
        const _authOther = await ctx.model.queryOne(
          `select * from aAuth a where a.deleted=0 and a.iid=? and a.profileId like '${unionid}:%' and a.id<>?`,
          [ctx.instance.id, authId]
        );
        if (_authOther && _authOther.userId !== authUserId) {
          // update userId for this auth
          await this.modelAuth.update({ id: authId, userId: _authOther.userId });
        }
      }
      // ready
      return profileUser;
    }
  }
  return Local;
};
