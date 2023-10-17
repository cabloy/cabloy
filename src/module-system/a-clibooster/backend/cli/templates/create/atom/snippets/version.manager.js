module.exports = {
  file: 'backend/src/bean/version.manager.js',
  async transform({ cli, ast, argv, ctx }) {
    // update
    if (ast.has(`const fileVersionUpdates = [$_$]`)) {
      ast.replace(`const fileVersionUpdates = [$_$]`, `const fileVersionUpdates = [$_$, ${argv.fileVersion}]`);
    } else {
      ast.replace(`const fileVersionUpdates = []`, `const fileVersionUpdates = [${argv.fileVersion}]`);
    }
    // init
    if (ast.has(`const fileVersionInits = [$_$]`)) {
      ast.replace(`const fileVersionInits = [$_$]`, `const fileVersionInits = [$_$, ${argv.fileVersion}]`);
    } else {
      ast.replace(`const fileVersionInits = []`, `const fileVersionInits = [${argv.fileVersion}]`);
    }
    // ok
    return ast;
  },
};
