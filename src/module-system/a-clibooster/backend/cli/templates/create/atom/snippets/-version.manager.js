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

const __snippet_init = `if (options.version === <%=argv.fileVersion%>) {
  // add role rights
  const roleRights = [
    { roleName: 'authenticated', action: 'create' },
    { roleName: 'authenticated', action: 'read', scopeNames: 0 },
    { roleName: 'authenticated', action: 'write', scopeNames: 0 },
    { roleName: 'authenticated', action: 'delete', scopeNames: 0 },
    { roleName: 'authenticated', action: 'clone', scopeNames: 0 },
    { roleName: 'authenticated', action: 'deleteBulk' },
    { roleName: 'authenticated', action: 'exportBulk' },
    { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
  ];
  await this.ctx.bean.role.addRoleRightBatch({ atomClassName: '<%=argv.atomClassName%>', roleRights });
}`;

module.exports = {
  file: 'backend/src/bean/version.manager.js',
  async transform({ cli, ast, argv, ctx }) {
    // update
    let code = await cli.template.renderContent({ content: __snippet_update });
    ast.replace(`async update($$$0) {$$$1}`, `async update($$$0) {$$$1 \n ${code}}`);
    // init
    code = await cli.template.renderContent({ content: __snippet_init });
    ast.replace(`async init($$$0) {$$$1}`, `async init($$$0) {$$$1 \n ${code}}`);
    // ok
    return ast;
  },
};
