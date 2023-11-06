module.exports = app => {
  return {
    bean: 'tools.demo',
    resource: {
      atomStaticKey: 'cliTools',
    },
    info: {
      version: '5.0.0',
      title: 'Cli: Tools: Demo',
      usage: 'npm run cli :tools:demo method1 [method2]',
    },
    options: {
      transaction: {
        description: 'transaction',
        type: 'boolean',
      },
    },
    // groups: null,
  };
};
