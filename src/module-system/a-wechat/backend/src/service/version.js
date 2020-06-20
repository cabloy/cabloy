module.exports = app => {

  class Version extends app.Service {

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

    }

    async init(options) {
    }

    async test() {
    }

  }

  return Version;
};
