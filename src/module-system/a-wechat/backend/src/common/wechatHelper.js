const require3 = require('require3');
const bb = require3('bluebird');
const extend = require3('extend2');

module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class WechatHelper {

    getSceneInfo(scene) {
      if (scene === 1) return { authProvider: 'wechat' };
      if (scene === 2) return { authProvider: 'wechatMini' };
    }

    // scene: 1/wechat 2/wechatMini
    async verifyAuthUser({ scene, openid, userInfo, cbVerify, state = 'login' }) {
      if (state === 'associate') {
        // check if ctx.user exists
        if (!ctx.user || ctx.user.agent.anonymous) return ctx.throw(403);
      }
      // ensure wechat user
      const userWechatId = await this._ensureWechatUser({ scene, openid, userInfo });
      // ensure auth user
      const profileUser = await this._ensureAuthUser({ scene, openid, userInfo, state });
      // verify
      let verifyUser;
      if (!cbVerify) {
        verifyUser = await ctx.meta.user.verify({ state, profileUser });
        await ctx.login(verifyUser);
      } else {
        verifyUser = await bb.fromCallback(cb => {
          cbVerify(profileUser, cb);
        });
      }
      // update wechat userId
      await this._updateWechatUser({ userId: verifyUser.agent.id, userWechatId, userInfo, state });
      // ok
      return verifyUser;
    }

    async _ensureWechatUser({ scene, openid, userInfo }) {
      let userWechatId;
      // wechat user
      let userWechat = await ctx.model.wechatUser.get({ openid });
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
      const fields = [ 'scene', 'openid', 'unionid', 'nickname', 'subscribe', 'sex', 'language', 'city', 'province', 'country', 'headimgurl', 'subscribe_time', 'remark', 'groupid', 'subscribe_scene', 'qr_scene', 'qr_scene_str' ];
      userInfo.scene = scene;
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
          const res = await ctx.model.wechatUser.insert(userWechat);
          userWechatId = res.insertId;
        } else {
          await ctx.model.wechatUser.update(userWechat);
        }
      }
      // ok
      return userWechatId;
    }

    async _updateWechatUser({ userId, userWechatId, userInfo }) {
      const unionid = userInfo.unionid || '';
      if (unionid) {
        // update all
        await ctx.model.query(
          'update aWechatUser a set a.userId=? where a.deleted=0 and a.iid=? and a.unionid=?',
          [ userId, ctx.instance.id, unionid ]
        );
      } else {
        // update this
        await ctx.model.wechatUser.update({ id: userWechatId, userId });
      }
    }

    // profileId : unionid:openid
    async _ensureAuthUser({ scene, openid, userInfo, state }) {
      // model auth
      const modelAuth = ctx.model.module('a-base').auth;
      //
      const sceneInfo = this.getSceneInfo(scene);
      const unionid = userInfo.unionid || '';
      const profileId = `${unionid}:${openid}`;
      const profileUser = {
        module: moduleInfo.relativeName,
        provider: sceneInfo.authProvider,
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
      const providerItem = await ctx.meta.user.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: sceneInfo.authProvider,
      });
      // check auth
      let authId;
      let authUserId;
      const authItems = await ctx.model.query(
        `select * from aAuth a where a.deleted=0 and a.iid=? and a.providerId=? and a.profileId like '%:${openid}'`,
        [ ctx.instance.id, providerItem.id ]
      );
      const authItem = authItems[0];
      if (!authItem) {
        // always set avatar empty
        const _profile = extend(true, {}, profileUser.profile);
        delete _profile.avatar;
        // insert auth
        const res = await modelAuth.insert({
          providerId: providerItem.id,
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
        await modelAuth.update({
          id: authItem.id,
          profileId,
          profile: JSON.stringify(_profile),
        });
        authId = authItem.id;
        authUserId = authItem.userId;
      }
      // check if has userId for unionid
      if (unionid) {
        if (state === 'associate') {
          await ctx.model.query(
            `update aAuth a set a.userId=? where a.deleted=0 and a.iid=? and a.profileId like '${unionid}:%'`,
            [ ctx.user.agent.id, ctx.instance.id ]
          );
        } else {
          const _authOthers = await ctx.model.query(
            `select * from aAuth a where a.deleted=0 and a.iid=? and a.profileId like '${unionid}:%' and a.id<>?`,
            [ ctx.instance.id, authId ]
          );
          const _authOther = _authOthers[0];
          if (_authOther && _authOther.userId !== authUserId) {
            // update userId for this auth
            await modelAuth.update({ id: authId, userId: _authOther.userId });
          }
        }
      }
      // ready
      return profileUser;
    }

  }

  return WechatHelper;
};
