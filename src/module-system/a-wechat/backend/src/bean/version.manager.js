module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version extends app.meta.BeanBase {
    get modelWechatUser() {
      return this.ctx.model.wechatUser;
    }
    get modelAuth() {
      return this.ctx.model.module('a-auth').auth;
    }
    get modelAuthProvider() {
      return this.ctx.model.module('a-auth').authProvider;
    }

    async update(options) {
      if (options.version === 1) {
        // create table: aWechatUser
        const sql = `
          CREATE TABLE aWechatUser (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            scene int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            openid varchar(255) DEFAULT NULL,
            unionid varchar(255) DEFAULT NULL,
            nickname varchar(50) DEFAULT NULL,
            subscribe int(11) DEFAULT '0',
            sex int(11) DEFAULT '0',
            language varchar(50) DEFAULT NULL,
            city varchar(50) DEFAULT NULL,
            province varchar(50) DEFAULT NULL,
            country varchar(50) DEFAULT NULL,
            headimgurl varchar(255) DEFAULT NULL,
            subscribe_time int(11) DEFAULT '0',
            remark varchar(255) DEFAULT NULL,
            groupid int(11) DEFAULT '0',
            subscribe_scene varchar(50) DEFAULT NULL,
            qr_scene int(11) DEFAULT '0',
            qr_scene_str varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 2) {
        const sql = `
          ALTER TABLE aWechatUser
            CHANGE COLUMN scene scene varchar(255) DEFAULT NULL
        `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 3) {
        const sql = `
          ALTER TABLE aWechatUser
            CHANGE COLUMN scene providerScene varchar(255) DEFAULT NULL,
            ADD COLUMN providerName varchar(255) DEFAULT NULL
        `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 4) {
        // all instances
        const instances = await this.ctx.bean.instance.list({ where: {} });
        for (const instance of instances) {
          await this.ctx.meta.util.executeBean({
            subdomain: instance.name,
            beanModule: moduleInfo.relativeName,
            beanFullName: `${moduleInfo.relativeName}.version.manager`,
            context: options,
            fn: 'update4Auths',
          });
        }
      }
    }

    async init(options) {}

    async test() {}

    async update4Auths() {
      await this.update4Auths_wechatUser();
      await this.update4Auths_wechatmini();
    }

    async update4Auths_wechatUser() {
      // scene -> providerName, providerScene
      const items = await this.modelWechatUser.select({});
      for (const item of items) {
        if (item.providerName) continue;
        const scene = item.providerScene;
        if (['wechat', 'wechatweb'].includes(scene)) {
          item.providerName = scene;
          item.providerScene = null;
          await this.modelWechatUser.update(item);
        } else if (scene.indexOf('wechatmini') > -1) {
          const providerScene = scene.substring('wechatmini'.length);
          if (providerScene) {
            item.providerName = 'wechatmini';
            item.providerScene = providerScene;
            await this.modelWechatUser.update(item);
          }
        } else {
          // invalid data
          await this.modelWechatUser.delete({ id: item.id });
        }
      }
    }

    async update4Auths_wechatmini() {
      // wechatminiXXX
      const providers = await this.ctx.model.query(
        `
        select * from aAuthProvider 
          where iid=? and providerName like 'wechatmini%'
        `,
        [this.ctx.instance.id]
      );
      let providerDefault;
      for (const provider of providers) {
        const providerName = provider.providerName;
        const providerScene = providerName.substring('wechatmini'.length);
        if (!providerScene) continue;
        if (providerScene === 'default') {
          providerDefault = provider;
          await this.modelAuthProvider.update({
            id: provider.id,
            providerName: 'wechatmini',
          });
        } else {
          await this.modelAuthProvider.delete({ id: provider.id });
        }
      }
      // auths
      if (!providerDefault) {
        // donothing
      }
      for (const provider of providers) {
        const providerName = provider.providerName;
        const providerScene = providerName.substring('wechatmini'.length);
        if (!providerScene) continue;
        await this.ctx.model.query(
          `
          update aAuth set providerId=?, providerScene=?
            where iid=? and providerId=?
          `,
          [providerDefault.id, providerScene, this.ctx.instance.id, provider.id]
        );
      }
    }
  }

  return Version;
};
