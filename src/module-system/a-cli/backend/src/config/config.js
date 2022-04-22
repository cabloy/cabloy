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
  };
  return config;
};
