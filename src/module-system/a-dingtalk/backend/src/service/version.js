module.exports = app => {

  class Version extends app.Service {

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
            orderInDepts JSON DEFAULT NULL,
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
    }

    async init(options) {
      if (options.version === 1) {
        // roleFunctions
        const roleFunctions = [
          { roleName: 'system', name: 'contacts' },
        ];
        await this.ctx.meta.role.addRoleFunctionBatch({ roleFunctions });
      }
    }

    async test() {
    }

  }

  return Version;
};
