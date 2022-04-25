// eslint-disable-next-line
module.exports = appInfo => {
  const config = {
    helper: {
      chalk: {
        options: { level: 2 },
      },
      boxen: {
        options: { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' },
      },
    },
    template: {
      render: {
        fileMapping: {
          gitignore: '.gitignore',
          _gitignore: '.gitignore',
          '_.gitignore': '.gitignore',
          '_package.json': 'package.json',
          '_.eslintrc': '.eslintrc',
          '_.eslintignore': '.eslintignore',
          '_.npmignore': '.npmignore',
          '_.eslintrc.js': '.eslintrc.js',
        },
        ignore: ['.DS_Store'],
      },
    },
  };
  return config;
};
