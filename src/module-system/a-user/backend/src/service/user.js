module.exports = app => {
  class User extends app.Service {
    async save({ data, user }) {
      // id
      data.id = user.id;
      // readOnly
      delete data.userName;
      delete data.email;
      delete data.mobile;
      delete data.locale;
      // save
      return await this.ctx.bean.user.save({ user: data });
    }

    async saveAvatar({ data, user }) {
      const userData = { id: user.id, avatar: data.avatar };
      return await this.ctx.bean.user.save({ user: userData });
    }

    async saveLocale({ data, user }) {
      const userData = { id: user.id, locale: data.locale };
      return await this.ctx.bean.user.save({ user: userData });
    }

    async agent({ userId }) {
      return await this.ctx.bean.user.agent({ userId });
    }

    async agentsBy({ userId }) {
      return await this.ctx.bean.user.agentsBy({ userId });
    }

    async userByMobile({ mobile }) {
      return await this.ctx.bean.user.exists({ mobile });
    }

    async addAgent({ userIdAgent, userId }) {
      return await this.ctx.bean.user.addAgent({ userIdAgent, userId });
    }

    async removeAgent({ userIdAgent, userId }) {
      return await this.ctx.bean.user.removeAgent({ userIdAgent, userId });
    }

    async switchAgent({ userIdAgent }) {
      return await this.ctx.bean.user.switchAgent({ userIdAgent });
    }

    async switchOffAgent() {
      return await this.ctx.bean.user.switchOffAgent();
    }

    async authentications({ user }) {
      // 1. get auth providers list from a-login
      const listLogin = await this.ctx.meta.util.performAction({
        method: 'post',
        url: '/a/login/auth/list',
      });
      if (listLogin.length === 0) return [];
      const ids = listLogin.map(item => item.id);
      // 2. list with aAuth
      const sql = `
        select a.id as providerId,a.module,a.providerName,b.id as authId from aAuthProvider a
          left join aAuth b on a.id=b.providerId and b.userId=?
            where a.id in (${ids.join(',')})
      `;
      const list = await this.ctx.model.query(sql, [user.id]);
      // sort
      list.sort((a, b) => ids.findIndex(item => item === a.providerId) - ids.findIndex(item => item === b.providerId));
      // meta
      const authProviders = this.ctx.bean.base.authProviders();
      for (const item of list) {
        const key = `${item.module}:${item.providerName}`;
        const authProvider = authProviders[key];
        item.meta = authProvider.meta;
      }
      // ok
      return list;
    }

    async authenticationDisable({ authId, user }) {
      // must use userId in where
      await this.ctx.model.query('delete from aAuth where id=? and userId=?', [authId, user.id]);
    }

    async themeLoad({ user }) {
      const name = `user-theme:${user.id}`;
      return await this.ctx.bean.status.get(name);
    }

    async themeSave({ theme, user }) {
      const name = `user-theme:${user.id}`;
      await this.ctx.bean.status.set(name, theme);
    }
  }

  return User;
};
