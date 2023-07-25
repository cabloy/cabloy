module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // // create table: aDetail
        // let sql = `
        //   CREATE TABLE aDetail (
        //     id int(11) NOT NULL AUTO_INCREMENT,
        //     createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        //     updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        //     deleted int(11) DEFAULT '0',
        //     iid int(11) DEFAULT '0',
        //     atomId int(11) DEFAULT '0',
        //     atomStage int(11) DEFAULT '0',
        //     detailItemId int(11) DEFAULT '0',
        //     detailClassId int(11) DEFAULT '0',
        //     detailCodeId int(11) DEFAULT '0',
        //     detailCode varchar(255) DEFAULT NULL,
        //     detailName varchar(255) DEFAULT NULL,
        //     detailLineNo int(11) DEFAULT '0',
        //     detailStatic int(11) DEFAULT '0',
        //     detailStaticKey varchar(255) DEFAULT NULL,
        //     userIdCreated int(11) DEFAULT '0',
        //     userIdUpdated int(11) DEFAULT '0',
        //     PRIMARY KEY (id)
        //   )
        // `;
        // await this.ctx.model.query(sql);
        // // create table: aDetailClass
        // sql = `
        //   CREATE TABLE aDetailClass (
        //     id int(11) NOT NULL AUTO_INCREMENT,
        //     createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        //     updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        //     deleted int(11) DEFAULT '0',
        //     iid int(11) DEFAULT '0',
        //     module varchar(255) DEFAULT NULL,
        //     detailClassName varchar(255) DEFAULT NULL,
        //     PRIMARY KEY (id)
        //   )
        // `;
        // await this.ctx.model.query(sql);
      }
      if (options.version === 2) {
        // create table: aDetailBase
        const sql = `
          CREATE TABLE aDetailBase (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomIdMain int(11) DEFAULT '0',
            atomClassIdMain int(11) DEFAULT '0',
            atomStage int(11) DEFAULT '0',
            detailId int(11) DEFAULT '0',
            detailClassId int(11) DEFAULT '0',
            detailStaticKey varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {}

    async test() {}
  }

  return Version;
};
