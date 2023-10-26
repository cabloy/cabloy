module.exports = app => {
  return {
    bean: 'git.commit',
    resource: {
      atomStaticKey: 'cliGit',
    },
    info: {
      version: '5.0.0',
      title: 'Cli: Git Commit',
      usage: 'npm run cli :git:commit message',
    },
    options: {},
    groups: {
      default: {
        questions: {
          message: {
            type: 'input',
            message: 'message',
            initial: {
              expression: 'context.argv._[0]',
            },
            required: true,
          },
        },
      },
    },
  };
};
