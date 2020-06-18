const require3 = require('require3');
const bb = require3('bluebird');
const extend = require3('extend2');
const WechatAPI = require3('@zhennann/co-wechat-api');
const authProviderScenes = require('./authProviderScenes.js');

module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class WechatHelper {

    getSceneInfo(scene) {
      return authProviderScenes.getScene(scene);
    }

    createWechatApi() {
      const self = this;
      return new Proxy({}, {
        get(obj, prop) {
          if (obj[prop]) return obj[prop];
          if (prop === 'app') {
            // app
            obj[prop] = self._createWechatApiApp();
          } else if (prop === 'mini') {
            // mini
            obj[prop] = self._createWechatApiMini();
          } else if (prop === 'util') {
            // util
            obj[prop] = self._createWechatApiUtil();
          }
          return obj[prop];
        },
      });
    }

    // scene: 1/wechat 2/wechatmini
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

    _createWechatApiApp() {
      // config
      const config = ctx.config.module(moduleInfo.relativeName).account.public;
      // api
      const api = new WechatAPI(config.appID, config.appSecret,
        async function() {
          const cacheKey = 'wechat-token';
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(token) {
          const cacheKey = 'wechat-token';
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
        }
      );
      // registerTicketHandle
      api.registerTicketHandle(
        async function(type) {
          const cacheKey = `wechat-jsticket:${type}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(type, token) {
          const cacheKey = `wechat-jsticket:${type}`;
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
        }
      );
      // ready
      return api;
    }

    _createWechatApiMini() {
      // config
      const config = ctx.config.module(moduleInfo.relativeName).account.mini;
      // api
      const api = new WechatAPI(config.appID, config.appSecret,
        async function() {
          const cacheKey = 'wechatmini-token';
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(token) {
          const cacheKey = 'wechatmini-token';
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
        }
      );
      // registerTicketHandle
      api.registerTicketHandle(
        async function(type) {
          const cacheKey = `wechatmini-jsticket:${type}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(type, token) {
          const cacheKey = `wechatmini-jsticket:${type}`;
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, token, token.expireTime - Date.now());
        }
      );
      // registerSessionKeyHandle
      api.registerSessionKeyHandle(
        async function() {
          const cacheKey = `wechatmini-sessionKey:${ctx.user.agent.id}`;
          return await ctx.cache.db.module(moduleInfo.relativeName).get(cacheKey);
        },
        async function(sessionKey) {
          const cacheKey = `wechatmini-sessionKey:${ctx.user.agent.id}`;
          await ctx.cache.db.module(moduleInfo.relativeName).set(cacheKey, sessionKey);
        }
      );
      // ready
      return api;
    }

    _createWechatApiUtil() {
      return {
        // scene: empty/wechat/wechatmini/wechatweb/xxx,xxx,xxx
        in(scene) {
          // scene
          if (!scene) scene = 'wechat';
          if (typeof scene === 'string') scene = scene.split(',');
          // provider
          const provider = ctx.user && ctx.user.provider;
          if (!provider) return false;
          // find any match
          for (const item of scene) {
            const ok = (provider.module === moduleInfo.relativeName && provider.providerName === item);
            if (ok) return true;
          }
          // not found
          return false;
        },
      };
    }

  }

  return WechatHelper;
};
