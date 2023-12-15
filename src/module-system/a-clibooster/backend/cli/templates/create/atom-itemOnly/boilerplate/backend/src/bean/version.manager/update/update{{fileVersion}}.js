module.exports = class VersionUpdate {
  async run(options) {
    // create table: <%=argv.providerId%><%=argv.atomClassNameCapitalize%>
    const sql = `
        CREATE TABLE <%=argv.providerId%><%=argv.atomClassNameCapitalize%> (
          id int(11) NOT NULL AUTO_INCREMENT,
          createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          deleted int(11) DEFAULT '0',
          iid int(11) DEFAULT '0',
          userId int(11) DEFAULT '0',
          name varchar(50) DEFAULT NULL,
          description varchar(255) DEFAULT NULL,
          PRIMARY KEY (id)
        )
      `;
    await this.ctx.model.query(sql);
  }
};
