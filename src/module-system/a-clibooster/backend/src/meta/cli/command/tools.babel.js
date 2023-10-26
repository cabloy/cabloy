module.exports = app => {
  return {
    bean: 'tools.babel',
    resource: {
      atomStaticKey: 'cliTools',
    },
    info: {
      version: '5.0.0',
      title: 'Cli: Tools: Babel',
      usage: 'npm run cli :tools:babel file1 [file2]',
    },
    // options: null,
    // groups: null,
  };
};
