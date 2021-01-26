module.exports = app => {

  class Version extends app.meta.BeanBase {

    async update(options) {
      if (options.version === 3) {
        // create table: aLayout
        let sql = `
          CREATE TABLE aLayout (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            description varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
          `;
        await this.ctx.model.query(sql);

        // create table: aLayoutContent
        sql = `
          CREATE TABLE aLayoutContent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            content JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create view: aLayoutViewFull
        sql = `
          CREATE VIEW aLayoutViewFull as
            select a.*,b.content from aLayout a
              left join aLayoutContent b on a.id=b.itemId
        `;
        await this.ctx.model.query(sql);

      }
    }

    async init(options) {
    }

  }

  return Version;
};
