module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassUser = {
    module: moduleInfo.relativeName,
    atomClassName: 'user',
  };

  class User {
    async get(where) {
      const keys = Object.keys(where);
      if (keys.length === 1 && keys[0] === 'id') {
        return await this.getCacheUser({ userId: where.id });
      }
      return await this.model.get(where);
    }

    async add(
      { disabled = 0, userName, realName, email, mobile, avatar, motto, locale, anonymous = 0 },
      user,
      returnKey
    ) {
      // check if incomplete information
      let needCheck;
      if (anonymous) {
        needCheck = false;
      } else if (this.config.checkUserName === true) {
        needCheck = userName || email || mobile;
      } else {
        needCheck = email || mobile;
      }
      // if exists
      if (needCheck) {
        const res = await this.exists({ userName, email, mobile });
        if (res) ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      if (!user) {
        user = { id: 0 };
      }
      // create
      const itemCreate = {
        disabled,
        anonymous,
      };
      const userKey = await ctx.bean.atom.create({
        atomClass: __atomClassUser,
        item: itemCreate,
        user,
      });
      // write
      const item = {
        userName,
        realName,
        email,
        mobile,
        avatar,
        motto,
        locale,
      };
      if (userName) {
        item.atomName = userName;
      }
      await ctx.bean.atom.write({
        key: userKey,
        item,
        user,
      });
      // submit
      await ctx.bean.atom.submit({
        key: userKey,
        options: { ignoreFlow: true },
        user,
      });
      // user verify event
      item.id = userKey.itemId;
      item.disabled = disabled;
      item.anonymous = anonymous;
      await ctx.bean.event.invoke({
        module: moduleInfo.relativeName,
        name: 'userAdd',
        data: { user: item },
      });
      // ok
      return returnKey ? userKey : userKey.itemId;
    }

    async exists({ userName, email, mobile }) {
      userName = userName || '';
      email = email || '';
      mobile = mobile || '';
      if (this.config.checkUserName !== true) {
        userName = '';
      }
      // where
      const clause = {};
      clause.__or__ = [];
      if (userName) clause.__or__.push({ userName });
      if (email) clause.__or__.push({ email });
      if (mobile) clause.__or__.push({ mobile });
      if (clause.__or__.length === 0) return null;
      const where = ctx.model._where(clause);
      return await this.model.queryOne(
        `select * from aUser
            ${where} and iid=? and deleted=0`,
        [ctx.instance.id]
      );
    }

    async save({ user }) {
      // not use atom.write
      const userId = user.id;
      if (userId && Object.keys(user).length > 1) {
        await this.model.update(user);
      }
      if (user.userName) {
        const userAtomId = await this._forceUserAtomId({ userAtomId: null, userId });
        await ctx.bean.atom.modelAtom.update({
          id: userAtomId,
          atomName: user.userName,
        });
      }
    }

    async changeUserName({ user }) {
      // check allowChangeUserName
      const item = await this.get({ id: user.id });
      if (item.allowChangeUserName === 0) ctx.throw(403);
      // change
      user = {
        ...user,
        allowChangeUserName: 0,
        lastTimeChangeUserName: new Date(),
      };
      await this.save({ user });
    }

    async getFields({ removePrivacy }) {
      let fields = await this.model.columns();
      if (removePrivacy) {
        fields = ctx.bean.util.extend({}, fields);
        const privacyFields = ctx.config.module(moduleInfo.relativeName).user.privacyFields.split(',');
        for (const privacyField of privacyFields) {
          delete fields[privacyField];
        }
      }
      return fields;
    }

    async getFieldsSelect({ removePrivacy, alias }) {
      const fields = await this.getFields({ removePrivacy });
      return Object.keys(fields)
        .map(item => (alias ? `${alias}.${item}` : item))
        .join(',');
    }

    async count({ options, user }) {
      return await this.select({ options, user, count: 1 });
    }

    async select({ options, user, pageForce = true, count = 0 }) {
      return await this._list({ options, user, pageForce, count });
    }

    async selectGeneral({ params, user, pageForce = true, count = 0 }) {
      const { query, page } = params;
      const options = {
        where: {
          'f.anonymous': 0,
          'f.disabled': 0,
        },
        orders: [['f.userName', 'asc']],
        page,
        removePrivacy: true,
      };
      if (query) {
        options.where.__or__ = [
          { 'f.userName': { op: 'like', val: query } },
          { 'f.realName': { op: 'like', val: query } },
          { 'f.mobile': { op: 'like', val: query } },
        ];
      }
      return await this._list({ options, user, pageForce, count });
    }

    // options: { where, orders, page, removePrivacy, ... }
    async _list({ options, user, pageForce = true, count = 0 }) {
      if (!options) options = {};
      // select
      const items = await ctx.bean.atom.select({ atomClass: __atomClassUser, options, user, pageForce, count });
      // count
      if (count) return items;
      // removePrivacy
      const removePrivacy = options.removePrivacy;
      if (!removePrivacy) return items;
      // fields
      const fields = await this.getFields({ removePrivacy });
      const fieldNames = Object.keys(fields);
      const itemsRes = [];
      for (const item of items) {
        const itemRes = {};
        for (const fieldName of fieldNames) {
          itemRes[fieldName] = item[fieldName];
        }
        itemRes.itemId = item.itemId;
        itemsRes.push(itemRes);
      }
      // ok
      return itemsRes;
    }

    async disable({ userAtomId, userId, disabled }) {
      const item = await this._forceUser({ userAtomId, userId });
      const key = { atomId: item.atomId, itemId: item.id };
      if (disabled) {
        await ctx.bean.atom.disable({ key, user: { id: 0 } });
      } else {
        await ctx.bean.atom.enable({ key, user: { id: 0 } });
      }
    }

    async delete({ userAtomId, userId }) {
      userAtomId = await this._forceUserAtomId({ userAtomId, userId });
      // delete this
      await ctx.bean.atom.delete({ key: { atomId: userAtomId } });
    }

    async _forceUserAtomId({ userAtomId, userId }) {
      if (!userAtomId) {
        const item = await this.get({ id: userId });
        userAtomId = item.atomId;
      }
      return userAtomId;
    }

    async _forceUserId({ userAtomId, userId }) {
      if (!userId) {
        const item = await this.get({ atomId: userAtomId });
        userId = item.id;
      }
      return userId;
    }

    async _forceUser({ userAtomId, userId }) {
      if (userAtomId) {
        return await this.get({ atomId: userAtomId });
      }
      return await this.get({ id: userId });
    }

    async _forceUserAndCheckRightRead({ userAtomId, userId, user }) {
      const _user = await this._forceUser({ userAtomId, userId });
      if (!user || user.id === 0) return _user;
      // check
      const res = await ctx.bean.atom.checkRightRead({
        atom: { id: _user.atomId },
        user,
      });
      if (!res) ctx.throw(403);
      return _user;
    }
  }
  return User;
};

// async save({ user }) {
//   // userKey
//   const userAtomId = await this._forceUserAtomId({ userId: user.id });
//   const userKey = { atomId: userAtomId };
//   // item
//   const item = { ...user };
//   if (user.userName) {
//     item.atomName = user.userName;
//   }
//   await ctx.bean.atom.write({
//     key: userKey,
//     item,
//     user: { id: 0 },
//   });
// }

// async list({ roleId, query, anonymous, page, removePrivacy }) {
//   const roleJoin = roleId ? 'left join aUserRole b on a.id=b.userId' : '';
//   const roleWhere = roleId ? `and b.roleId=${ctx.model._format(roleId)}` : '';
//   const queryLike = query ? ctx.model._format({ op: 'like', val: query }) : '';
//   const queryWhere = query
//     ? `and ( a.userName like ${queryLike} or a.realName like ${queryLike} or a.mobile like ${queryLike} )`
//     : '';
//   const anonymousWhere = anonymous !== undefined ? `and a.anonymous=${ctx.model._format(anonymous)}` : '';
//   const _limit = ctx.model._limit(page.size, page.index);
//   // fields
//   const fields = await this.getFieldsSelect({ removePrivacy, alias: 'a' });
//   // sql
//   const sql = `
//     select ${fields} from aUser a
//       ${roleJoin}
//         where a.iid=? and a.deleted=0
//               ${anonymousWhere}
//               ${roleWhere}
//               ${queryWhere}
//         order by a.userName asc
//         ${_limit}
//   `;
//   return await ctx.model.query(sql, [ctx.instance.id]);
// }
