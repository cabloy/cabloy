module.exports = class Version {
  async update(options) {
    if (options.version === 1) {
      // create table: aFile
      let sql = `
          CREATE TABLE aFile (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            downloadId varchar(50) DEFAULT NULL,
            atomId int(11) DEFAULT '0',
            mode int(11) DEFAULT '0',
            fileSize int(11) DEFAULT '0',
            width int(11) DEFAULT '0',
            height int(11) DEFAULT '0',
            filePath varchar(255) DEFAULT NULL,
            fileName varchar(255) DEFAULT NULL,
            realName varchar(255) DEFAULT NULL,
            fileExt varchar(50) DEFAULT NULL,
            encoding varchar(50) DEFAULT NULL,
            mime varchar(50) DEFAULT NULL,
            attachment int(11) DEFAULT '0',
            flag varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
      await this.ctx.model.query(sql);

      // aViewFile
      sql = `
          create view aViewFile as
            select a.*,b.userName,b.avatar from aFile a
              left join aUser b on a.userId=b.id
        `;
      await this.ctx.model.query(sql);
    }

    if (options.version === 2) {
      // aFile: mime
      const sql = `
        ALTER TABLE aFile
          CHANGE COLUMN mime mime varchar(255) DEFAULT NULL
        `;
      await this.ctx.model.query(sql);
    }
  }

  async init(options) {}

  async test() {}
};
