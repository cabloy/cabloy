const require3 = require('require3');
const extend = require3('extend2');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Local {
    get configModule() {
      return ctx.config.module(moduleInfo.relativeName);
    }
    get modelMember() {
      return ctx.model.module(moduleInfo.relativeName).member;
    }
    get modelAuth() {
      return ctx.model.module('a-auth').auth;
    }

    async verifyAuthUser({ beanProvider, memberId, member, state, needLogin = false }) {
      // userInfo(member)
      if (!member) {
        member = await this._getMemberByMemberId({ memberId });
        if (!member) return ctx.throw.module(moduleInfo.relativeName, 1008);
      }
      // ensure auth user
      const profileUser = await this._ensureAuthUser({ beanProvider, memberId: member.memberId, member });
      // verify
      const verifyUser = await ctx.bean.user.verify({ state, profileUser });
      if (needLogin) {
        await ctx.login(verifyUser);
      }
      // ok
      return verifyUser;
    }

    async _getMemberByMemberId({ memberId }) {
      return await this.modelMember.get({ memberId });
    }

    // profileId: wxwork:memberId
    async _ensureAuthUser({ beanProvider, memberId, member }) {
      const profileId = `wxwork:${memberId}`;
      const profileUser = {
        module: beanProvider.providerModule,
        provider: beanProvider.providerName,
        providerScene: beanProvider.providerScene,
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
        autoActivate: this.configModule.auth.autoActivate,
      };
      // provider
      const { providerItem } = beanProvider.configProviderCache;
      // check auth
      let authId;
      let authUserId;
      const authItem = await ctx.model.queryOne(
        'select * from aAuth a where a.deleted=0 and a.iid=? and a.providerId=? and a.providerScene=? and a.profileId=?',
        [ctx.instance.id, providerItem.id, beanProvider.providerScene, profileId]
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
          profile: JSON.stringify(_profile),
        });
        authId = authItem.id;
        authUserId = authItem.userId;
      }
      // check if has userId for memberId
      const _authOther = await ctx.model.queryOne(
        'select * from aAuth a where a.deleted=0 and a.iid=? and a.profileId=? and a.id<>?',
        [ctx.instance.id, profileId, authId]
      );
      if (_authOther && _authOther.userId !== authUserId) {
        // update userId for this auth
        await this.modelAuth.update({ id: authId, userId: _authOther.userId });
      }
      // ready
      return profileUser;
    }
  }
  return Local;
};
