const require3 = require('require3');
const bb = require3('bluebird');
const extend = require3('extend2');
const authProviderScenes = require('./authProviderScenes.js');

module.exports = function(ctx) {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class DingtalkHelper {

    getSceneInfo(scene) {
      return authProviderScenes.getScene(scene);
    }

    // scene: dingtalk/dingtalkweb/dingtalkadmin/dingtalkmini
    async verifyAuthUser({ scene, memberId, member, cbVerify, state, needLogin = true }) {
      // userInfo(member)
      if (!member) {
        member = await this._getMemberByMemberId({ memberId });
        if (!member) return ctx.throw.module(moduleInfo.relativeName, 1008);
      }
      // ensure auth user
      const profileUser = await this._ensureAuthUser({ scene, memberId: member.memberId, member });
      // verify
      let verifyUser;
      if (!cbVerify) {
        verifyUser = await ctx.meta.user.verify({ state, profileUser });
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

    async _getMemberByMemberId({ memberId }) {
      // model member
      const modelMember = ctx.model.module(moduleInfo.relativeName).member;
      return await modelMember.get({ memberId });
    }

    // profileId: dingtalk:memberId
    async _ensureAuthUser({ scene, memberId, member }) {
      // model auth
      const modelAuth = ctx.model.module('a-base').auth;
      //
      const sceneInfo = this.getSceneInfo(scene);
      const profileId = `dingtalk:${memberId}`;
      const profileUser = {
        module: moduleInfo.relativeName,
        provider: sceneInfo.authProvider,
        profileId,
        profile: {
          userName: member.name,
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

  }

  return DingtalkHelper;
};
