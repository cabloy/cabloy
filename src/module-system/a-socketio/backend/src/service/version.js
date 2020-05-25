module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      if (options.version === 1) {
        let sql;

        // create table: aSocketIOMessageClass
        sql = `
          CREATE TABLE aSocketIOMessageClass (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            messageClassName varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
        // create table: aSocketIOMessage
        sql = `
          CREATE TABLE aSocketIOMessage (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            messageClassId int(11) DEFAULT '0',
            messageType int(11) DEFAULT '0',
            messageFilter int(11) DEFAULT '0',
            messageGroup int(11) DEFAULT '0',
            messageRead int(11) DEFAULT '0',
            sessionId varchar(255) DEFAULT NULL,
            userIdTo int(11) DEFAULT '0',
            userIdFrom int(11) DEFAULT '0',
            content text DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
    }

    async test() {
    }

  }

  return Version;
};
