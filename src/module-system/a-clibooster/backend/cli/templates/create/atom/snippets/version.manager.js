const __snippet_update = `if (options.version === <%=argv.fileVersion%>) {
  // create table: <%=argv.providerId%><%=argv.atomClassNameCapitalize%>
  const sql = \`
    CREATE TABLE <%=argv.providerId%><%=argv.atomClassNameCapitalize%> (
      id int(11) NOT NULL AUTO_INCREMENT,
      createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted int(11) DEFAULT '0',
      iid int(11) DEFAULT '0',
      atomId int(11) DEFAULT '0',
      description varchar(255) DEFAULT NULL,
      PRIMARY KEY (id)
    )
  \`;
  await this.ctx.model.query(sql);
}`;
module.exports = {
  file: 'backend/src/bean/version.manager.js',
  async transform({ cli, ast, argv, ctx }) {
    // update
    const codeUpdate = await cli.template.renderContent({ content: __snippet_update });
    ast.replace(`async update(options) {$_$}`, `async update(options) {$_$ \n ${codeUpdate}}`);
    return ast;
  },
};
