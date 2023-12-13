module.exports = function SelfFactory(ctx) {
  // const moduleInfo = module.info;
  class VersionUpdate {
    async run(options) {
      // create table: aUserOnline
      let sql = `
        CREATE TABLE aUserOnline (
          id int(11) NOT NULL AUTO_INCREMENT,
          createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          deleted int(11) DEFAULT '0',
          iid int(11) DEFAULT '0',
          atomId int(11) DEFAULT '0',
          userId int(11) DEFAULT '0',
          loginCount int(11) DEFAULT '0',
          loginIPLast varchar(50) DEFAULT NULL,
          loginTimeLast timestamp DEFAULT NULL,
          onlineCount int(11) DEFAULT '0',
          onlineIPLast varchar(50) DEFAULT NULL,
          onlineTimeLast timestamp DEFAULT NULL,
          expireTime timestamp DEFAULT NULL,
          PRIMARY KEY (id)
        )
      `;
      await ctx.model.query(sql);
      // create table: aUserOnlineHistory
      sql = `
        CREATE TABLE aUserOnlineHistory (
          id int(11) NOT NULL AUTO_INCREMENT,
          createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          deleted int(11) DEFAULT '0',
          iid int(11) DEFAULT '0',
          atomId int(11) DEFAULT '0',
          userId int(11) DEFAULT '0',
          onlineIP varchar(50) DEFAULT NULL,
          onlineTime timestamp DEFAULT NULL,
          isLogin int(11) DEFAULT '0',
          PRIMARY KEY (id)
        )
      `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate;
};
