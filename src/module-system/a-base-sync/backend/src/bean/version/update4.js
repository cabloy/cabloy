module.exports = function(ctx) {

  class VersionUpdate4 {

    async run() {

      // aComment
      let sql = `
          CREATE TABLE aComment (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            sorting int(11) DEFAULT '0',
            heartCount int(11) DEFAULT '0',
            replyId int(11) DEFAULT '0',
            replyUserId int(11) DEFAULT '0',
            replyContent text DEFAULT NULL,
            content text DEFAULT NULL,
            summary text DEFAULT NULL,
            html text DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
      await ctx.model.query(sql);

      // aViewComment
      sql = `
          create view aViewComment as
            select a.*,b.userName,b.avatar,c.userName as replyUserName from aComment a
              left join aUser b on a.userId=b.id
              left join aUser c on a.replyUserId=c.id
        `;
      await ctx.model.query(sql);

      // aCommentHeart
      sql = `
          CREATE TABLE aCommentHeart (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            commentId int(11) DEFAULT '0',
            heart int(11) DEFAULT '1',
            PRIMARY KEY (id)
          )
        `;
      await ctx.model.query(sql);

      // aAtom
      sql = `
        ALTER TABLE aAtom
          MODIFY COLUMN updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          ADD COLUMN allowComment int(11) DEFAULT '1',
          ADD COLUMN starCount int(11) DEFAULT '0',
          ADD COLUMN commentCount int(11) DEFAULT '0',
          ADD COLUMN attachmentCount int(11) DEFAULT '0',
          ADD COLUMN readCount int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

    }

  }

  return VersionUpdate4;
};
