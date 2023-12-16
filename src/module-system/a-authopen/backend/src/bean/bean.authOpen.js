const randomize = require('randomatic');

const moduleInfo = module.info;

const __atomClassRole = {
  module: 'a-base',
  atomClassName: 'role',
};
const __atomClassAuthOpen = {
  module: moduleInfo.relativeName,
  atomClassName: 'authOpen',
};
module.exports = class AuthOpen {
  get modelAuthOpen() {
    return ctx.model.module(moduleInfo.relativeName).authOpen;
  }
  get modelResourceRole() {
    return ctx.model.module('a-base').resourceRole;
  }
  get localAuthSimple() {
    return ctx.bean.local.module('a-authsimple').simple;
  }

  async hideClientSecret({ atomId, itemId, user }) {
    const item = await this._forceAuthOpen({ atomId, itemId });
    const clientSecret = await this.localAuthSimple.calcPassword({ password: item.clientSecret });
    // use userId for safety
    await this.modelAuthOpen.update({
      id: itemId,
      userId: user.id,
      clientSecret,
      clientSecretHidden: 1,
    });
  }

  async resetClientSecret({ atomId, itemId, user }) {
    itemId = await this._forceAuthOpenId({ atomId, itemId });
    // clientSecret
    const clientSecret = randomize('0a', 40);
    // use userId for safety
    await this.modelAuthOpen.update({
      id: itemId,
      userId: user.id,
      clientSecret,
      clientSecretHidden: 0,
    });
  }

  async verify({ clientID, clientSecret }) {
    // authOpen
    const authOpen = await this.modelAuthOpen.get({ clientID });
    if (!authOpen) return ctx.throw(403);
    // clientSecret
    if (authOpen.clientSecretHidden) {
      const res = await this.localAuthSimple.verifyPassword({
        password: clientSecret,
        hash: authOpen.clientSecret,
      });
      if (!res) return ctx.throw(403);
    } else {
      if (clientSecret !== authOpen.clientSecret) return ctx.throw(403);
    }
    // atomDisabled
    const atom = await ctx.bean.atom.modelAtom.get({ id: authOpen.atomId });
    if (atom.atomDisabled) return ctx.throw(403);
    // neverExpire/expireTime
    if (!authOpen.neverExpire && authOpen.expireTime <= Date.now()) {
      return ctx.throw.module(moduleInfo.relativeName, 1001);
    }
    // done
    return authOpen;
  }

  isAuthOpen() {
    const provider = ctx.bean.util.getProperty(ctx, 'state.user.provider');
    if (!provider) return false;
    return provider.module === 'a-authopen' && provider.providerName === 'authopen' ? provider : null;
  }

  async prepareAuthOpen() {
    const provider = this.isAuthOpen();
    if (!provider) return null; // not auth open provider
    const authOpen = await this.getAuthOpenByAuthId({ authId: provider.id });
    // check full
    if (authOpen.scopeRoleName === 'RoleScopeFull') return null;
    // ok
    return authOpen;
  }

  async checkRightResource({ resourceAtomId }) {
    // authOpen
    const authOpen = await this.prepareAuthOpen();
    if (!authOpen) return true;
    // check
    const right = await ctx.model.queryOne(
      `
          select * from aViewRoleRightResource a
            where a.iid=? and a.roleIdWho=? and a.atomId=?
        `,
      [ctx.instance.id, authOpen.scopeRoleId, resourceAtomId]
    );
    return !!right;
  }

  async checkRightAtomAction({ atomClass, action }) {
    // authOpen
    const authOpen = await this.prepareAuthOpen();
    if (!authOpen) return true;
    // parse action code
    action = ctx.bean.atomAction.parseActionCode({
      action,
      atomClass,
    });
    // check
    const right = await ctx.model.queryOne(
      `
        select * from aViewRoleRightAtomClass a
            where a.iid=? and a.roleIdWho=? and a.atomClassId=? and action=?
      `,
      [ctx.instance.id, authOpen.scopeRoleId, atomClass.id, action]
    );
    return !!right;
  }

  async getAuthOpenByAuthId({ authId }) {
    return await ctx.model.queryOne(
      `
          select a.* from aAuthOpenView a
            inner join aAuth b on a.id=b.profileId
              where a.iid=? and a.deleted=0 and b.id=? 
        `,
      [ctx.instance.id, authId]
    );
  }

  async _forceAuthOpenId({ atomId, itemId }) {
    if (!itemId) {
      const item = await this.modelAuthOpen.get({ atomId });
      itemId = item.id;
    }
    return itemId;
  }

  async _forceAuthOpen({ atomId, itemId }) {
    if (!itemId) {
      return await this.modelAuthOpen.get({ atomId });
    }
    return await this.modelAuthOpen.get({ id: itemId });
  }

  // create aAuthOpen record for user
  async createAuthOpen({ item: { atomName, scopeRoleName, neverExpire = 1, expireTime = null }, user }) {
    // write
    const scopeRole = await ctx.bean.role.parseRoleName({ roleName: scopeRoleName });
    const item = {
      atomName,
      scopeRoleId: scopeRole.id,
      neverExpire,
      expireTime,
    };
    const authOpenKey = await ctx.bean.atom.write({
      atomClass: __atomClassAuthOpen,
      item,
      user,
    });
    // ok
    return authOpenKey;
  }

  async createRoleScopes({ roleScopes, setDirty = true }) {
    //
    for (const roleScope of roleScopes) {
      // item
      const item = { ...roleScope };
      // roleIdParent
      if (roleScope.roleIdParent === 0) {
        item.roleIdParent = 0;
      } else {
        const role = await ctx.bean.role.parseRoleName({ roleName: roleScope.roleIdParent });
        item.roleIdParent = role.id;
      }
      // loadAtomStatic
      const atomKey = await ctx.bean.atomStatic.loadAtomStatic({
        moduleName: moduleInfo.relativeName,
        atomClass: __atomClassRole,
        item,
      });
      if (atomKey && roleScope._roleRightsRead) {
        // role rights read
        const roleName = roleScope._roleRightsRead;
        const scopeNames = [atomKey.itemId];
        const roleRights = [{ roleName, action: 'read', scopeNames }];
        await ctx.bean.role.addRoleRightBatch({
          module: 'a-base',
          atomClassName: 'role',
          roleRights,
        });
      }
    }
    // setDirty
    if (setDirty) {
      await ctx.bean.role.setDirty(true);
    }
  }
};
