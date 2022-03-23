module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version extends app.meta.BeanBase {
    get modelAuth() {
      return this.ctx.model.module('a-auth').auth;
    }
    get modelAuthProvider() {
      return this.ctx.model.module('a-auth').authProvider;
    }

    async update(options) {
      if (options.version === 1) {
        let sql;

        // create table: aWxworkDepartment
        sql = `
          CREATE TABLE aWxworkDepartment (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            departmentId int(11) DEFAULT '0',
            departmentParentId int(11) DEFAULT '0',
            departmentName varchar(255) DEFAULT NULL,
            departmentNameEn varchar(255) DEFAULT NULL,
            departmentOrder int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aWxworkMember
        sql = `
          CREATE TABLE aWxworkMember (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            memberId varchar(255) DEFAULT NULL,
            name varchar(255) DEFAULT NULL,
            alias varchar(255) DEFAULT NULL,
            mobile varchar(255) DEFAULT NULL,
            department varchar(255) DEFAULT NULL,
            sorting varchar(255) DEFAULT NULL,
            position varchar(255) DEFAULT NULL,
            gender int(11) DEFAULT '0',
            email varchar(255) DEFAULT NULL,
            telephone varchar(255) DEFAULT NULL,
            is_leader_in_dept varchar(255) DEFAULT NULL,
            avatar varchar(255) DEFAULT NULL,
            thumb_avatar varchar(255) DEFAULT NULL,
            qr_code varchar(255) DEFAULT NULL,
            status int(11) DEFAULT '0',
            extattr JSON DEFAULT NULL,
            external_profile JSON DEFAULT NULL,
            external_position varchar(255) DEFAULT NULL,
            address varchar(255) DEFAULT NULL,
            hide_mobile int(11) DEFAULT '0',
            english_name varchar(255) DEFAULT NULL,
            open_userid varchar(255) DEFAULT NULL,
            main_department int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 2) {
        // all instances
        const instances = await this.ctx.bean.instance.list({ where: {} });
        for (const instance of instances) {
          await this.ctx.meta.util.executeBean({
            subdomain: instance.name,
            beanModule: moduleInfo.relativeName,
            beanFullName: `${moduleInfo.relativeName}.version.manager`,
            context: options,
            fn: 'update2Auths',
          });
        }
      }
    }

    async init(options) {}

    async test() {}

    async update2Auths() {
      await this.update2Auths_wxwork('wxwork');
      await this.update2Auths_wxwork('wxworkweb');
      await this.update2Auths_wxworkmini();
    }

    async update2Auths_wxwork(providerName) {
      const provideItem = await this.ctx.bean.authProvider.getAuthProvider({
        module: moduleInfo.relativeName,
        providerName,
      });
      await this.ctx.model.query('update aAuth a set a.providerScene=? where a.iid=? and a.providerId=?', [
        'selfBuilt',
        this.ctx.instance.id,
        provideItem.id,
      ]);
    }

    async update2Auths_wxworkmini() {
      // wxworkminiXXX
      const providers = await this.ctx.model.query(
        `
        select * from aAuthProvider 
          where iid=? and providerName like 'wxworkmini%'
        `,
        [this.ctx.instance.id]
      );
      let providerDefault;
      for (const provider of providers) {
        const providerName = provider.providerName;
        const providerScene = providerName.substring('wxworkmini'.length);
        if (!providerScene) continue;
        if (providerScene === 'default') {
          providerDefault = provider;
          await this.modelAuthProvider.update({
            id: provider.id,
            providerName: 'wxworkmini',
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
        const providerScene = providerName.substring('wxworkmini'.length);
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
