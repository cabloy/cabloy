module.exports = {
  file: 'backend/src/bean/version.manager.js',
  async transform({ cli, ast, argv, ctx }) {
    // update
    ast.replace(`const fileVersionUpdates = [$_$]`, `const fileVersionUpdates = [$_$, ${argv.fileVersion}]`);
    // init
    ast.replace(`const fileVersionInits = [$_$]`, `const fileVersionInits = [$_$, ${argv.fileVersion}]`);
    // ok
    return ast;
  },
};
