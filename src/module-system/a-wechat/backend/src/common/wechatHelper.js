const require3 = require('require3');
const bb = require3('bluebird');

module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class WechatHelper {

    async verifyAuthUser({ openid, userInfo, cbVerify }) {
      // ensure wechat user
      const userWechatId = await this._ensureWechatUser({ openid, userInfo });
      // ensure auth user
      const profileUser = await this._ensureAuthUser({ openid, userInfo });
      // verify
      let verifyUser;
      if (!cbVerify) {
        verifyUser = await ctx.meta.user.verify({ state: 'login', profileUser });
      } else {
        verifyUser = await bb.fromCallback(cb => {
          cbVerify(profileUser, cb);
        });
      }
      // update wechat userId
      await ctx.model.wechatUser.update({ id: userWechatId, userId: verifyUser.agent.id });
      // ok
      return verifyUser;
    }

    async _ensureWechatUser({ openid, userInfo }) {
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
          const res = await ctx.model.wechatUser.insert(userWechat);
          userWechatId = res.insertId;
        } else {
          await ctx.model.wechatUser.update(userWechat);
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
      const providerItem = await ctx.meta.user.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName: 'wechat',
      });
      // check auth
      let authId;
      let authUserId;
      const authItem = await ctx.model.query(
        `select * from aAuth a where a.deleted=0 and a.iid=? and a.providerId=? and a.profileId like '%:${openid}'`,
        [ ctx.instance.id, providerItem.id ]
      );
      if (!authItem) {
        // insert auth
        const res = await ctx.model.auth.insert({
          providerId: providerItem.id,
          profileId,
          profile: JSON.stringify(profileUser.profile),
        });
        authId = res.insertId;
      } else {
        // always update
        await ctx.model.auth.update({
          id: authItem.id,
          profileId,
          profile: JSON.stringify(profileUser.profile),
        });
        authId = authItem.id;
        authUserId = authItem.userId;
      }
      // check if has userId for unionid
      if (unionid) {
        const _authOther = await ctx.model.query(
          `select * from aAuth a where a.deleted=0 and a.iid=? and a.profileId like '${unionid}:%' and a.id<>?`,
          [ ctx.instance.id, authId ]
        );
        if (_authOther && _authOther.userId !== authUserId) {
          // update userId for this auth
          await ctx.model.auth.update({ id: authId, userId: _authOther.userId });
        }
      }
      // ready
      return profileUser;
    }

  }

  return WechatHelper;
};
