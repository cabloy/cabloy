const require3 = require('require3');
const bb = require3('bluebird');
const extend = require3('extend2');
const WxworkAPI = require3('@zhennann/co-wxwork-api');

module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class WechatHelper {

    getSceneInfo(scene) {
      if (scene === 1) return { authProvider: 'wxwork' };
      if (scene === 2) return { authProvider: 'wxworkMini' };
    }

    createWxworkApi() {
      const api = { };
      api.app = new Proxy({}, {
        get(obj, prop) {
          if (!obj[prop]) {
            obj[prop] = this._createWxworkApiApp({ appName: prop });
          }
          return obj[prop];
        },
      });
      return api;
    }

    // scene: 1/wxwork 2/wxworkMini
    async verifyAuthUser({ scene, member, code, cbVerify, state = 'login', needLogin = true }) {
      if (state === 'associate') {
        // not allowed associate
        return ctx.throw(403);
      }
      // userInfo(member)
      if (!member) {
        member = await this._getMemberByCode({ code });
      }
      // ensure auth user
      const profileUser = await this._ensureAuthUser({ scene, memberId: member.memberId, member });
      // verify
      let verifyUser;
      if (!cbVerify) {
        verifyUser = await ctx.meta.user.verify({ state: 'login', profileUser });
        if (needLogin) {
          await ctx.login(verifyUser);
        }
      } else {
        verifyUser = await bb.fromCallback(cb => {
          cbVerify(profileUser, cb);
        });
      }
      // ok
      return verifyUser;
    }

    async _getMemberByCode({ code }) {
      // code->userId(memberId)
      const api = this.createWxworkApi();
      const res = await api.app.selfBuilt.getUserIdByCode(code);
      if (res.errcode) {
        throw new Error(res.errmsg);
      }
      const memberId = res.UserId;
      if (!memberId) return ctx.throw(403);
      // model member
      const modelMember = ctx.model.module(moduleInfo.relativeName).member;
      const member = await modelMember.get({ memberId });
      if (!member) return ctx.throw(403);
      return member;
    }

    // profileId: wxwork:memberId
    async _ensureAuthUser({ scene, memberId, member }) {
      // model auth
      const modelAuth = ctx.model.module('a-base').auth;
      //
      const sceneInfo = this.getSceneInfo(scene);
      const profileId = `wxwork:${memberId}`;
      const profileUser = {
        module: moduleInfo.relativeName,
        provider: sceneInfo.authProvider,
        profileId,
        profile: {
          userName: member.alias || member.name,
          realName: member.name,
          avatar: member.avatar,
          email: member.email,
          mobile: member.mobile,
          emailConfirmed: true,
          mobileVerified: true,
          profile: member,
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
        'select * from aAuth a where a.deleted=0 and a.iid=? and a.providerId=? and a.profileId=?',
        [ ctx.instance.id, providerItem.id, profileId ]
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
          profile: JSON.stringify(_profile),
        });
        authId = authItem.id;
        authUserId = authItem.userId;
      }
      // check if has userId for memberId
      const _authOthers = await ctx.model.query(
        'select * from aAuth a where a.deleted=0 and a.iid=? and a.profileId=? and a.id<>?',
        [ ctx.instance.id, profileId, authId ]
      );
      const _authOther = _authOthers[0];
      if (_authOther && _authOther.userId !== authUserId) {
        // update userId for this auth
        await modelAuth.update({ id: authId, userId: _authOther.userId });
      }
      // ready
      return profileUser;
    }

    _createWxworkApiApp({ appName }) {
      // config
      const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
      // api
      const api = new WxworkAPI.CorpAPI(config.corpid, config.apps[appName].secret, appName,
        async function(appName) {
          const cacheKey = `wxwork-token:${appName || ''}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(token, appName) {
          const cacheKey = `wxwork-token:${appName || ''}`;
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
        }
      );
      // registerTicketHandle
      api.registerTicketHandle(
        async function(type) {
          const cacheKey = `wxwork-jsticket:${type}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(type, token) {
          const cacheKey = `wxwork-jsticket:${type}`;
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
        }
      );
      // ready
      return api;
    }

  }

  return WechatHelper;
};
