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

        // create table: aDingtalkDepartment
        sql = `
          CREATE TABLE aDingtalkDepartment (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            departmentId int(11) DEFAULT '0',
            departmentParentId int(11) DEFAULT '0',
            departmentName varchar(255) DEFAULT NULL,
            departmentOrder int(11) DEFAULT '0',
            createDeptGroup int(11) DEFAULT '0',
            autoAddUser int(11) DEFAULT '0',
            deptHiding int(11) DEFAULT '0',
            deptPermits TEXT DEFAULT NULL,
            userPermits TEXT DEFAULT NULL,
            outerDept int(11) DEFAULT '0',
            outerPermitDepts TEXT DEFAULT NULL,
            outerPermitUsers TEXT DEFAULT NULL,
            outerDeptOnlySelf int(11) DEFAULT '0',
            sourceIdentifier varchar(255) DEFAULT NULL,
            ext JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aDingtalkMember
        sql = `
          CREATE TABLE aDingtalkMember (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            memberId varchar(255) DEFAULT NULL,
            name varchar(255) DEFAULT NULL,
            active int(11) DEFAULT '0',
            avatar varchar(255) DEFAULT NULL,
            orderInDepts text DEFAULT NULL,
            department varchar(255) DEFAULT NULL,
            position varchar(255) DEFAULT NULL,
            mobile varchar(255) DEFAULT NULL,
            tel varchar(255) DEFAULT NULL,
            workPlace varchar(255) DEFAULT NULL,
            remark TEXT DEFAULT NULL,
            email varchar(255) DEFAULT NULL,
            orgEmail varchar(255) DEFAULT NULL,
            jobnumber varchar(255) DEFAULT NULL,
            isHide int(11) DEFAULT '0',
            isSenior int(11) DEFAULT '0',
            extattr JSON DEFAULT NULL,
            hiredDate timestamp DEFAULT NULL,
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
      await this.update2Auths_dingtalk('dingtalk');
      await this.update2Auths_dingtalk('dingtalkweb');
      await this.update2Auths_dingtalkmini();
    }

    async update2Auths_dingtalk(providerName) {
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

    async update2Auths_dingtalkmini() {
      // dingtalkminiXXX
      const providers = await this.ctx.model.query(
        `
        select * from aAuthProvider 
          where iid=? and providerName like 'dingtalkmini%'
        `,
        [this.ctx.instance.id]
      );
      let providerDefault;
      for (const provider of providers) {
        const providerName = provider.providerName;
        const providerScene = providerName.substring('dingtalkmini'.length);
        if (!providerScene) continue;
        if (providerScene === 'default') {
          providerDefault = provider;
          await this.modelAuthProvider.update({
            id: provider.id,
            providerName: 'dingtalkmini',
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
        const providerScene = providerName.substring('dingtalkmini'.length);
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
