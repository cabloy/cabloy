export const commandsConfig = {
  sets: {
    zova: {
      front: 'zova-cli-set-front',
    },
    vona: {
      api: 'vona-cli-set-api',
    },
  },
  helper: {
    chalk: {
      options: { level: 2 },
    },
    boxen: {
      options: {
        padding: 1,
        margin: 1,
        align: 'center',
        borderColor: 'yellow',
        borderStyle: 'round',
      },
    },
  },
  template: {
    render: {
      fileMapping: {
        'gitignore': '.gitignore',
        '_gitignore': '.gitignore',
        '_.gitignore': '.gitignore',
        '_package.json': 'package.json',
        '_.eslintrc': '.eslintrc',
        '_.eslintignore': '.eslintignore',
        '_.npmignore': '.npmignore',
        '_.npmrc': '.npmrc',
        '_.eslintrc.js': '.eslintrc.js',
        '_jsconfig.json': 'jsconfig.json',
        '_tsconfig.json': 'tsconfig.json',
        '_tsconfig.base.json': 'tsconfig.base.json',
        '_tsconfig.build.json': 'tsconfig.build.json',
      },
      ignore: ['.DS_Store'],
    },
  },
};
