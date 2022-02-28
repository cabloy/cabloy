const defaults = require('./defaults.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const behaviors = {
    // Overtime
    overtime: {
      title: 'Overtime',
      bean: 'overtime',
      icon: { f7: ':outline:timer-outline' },
      validator: {
        module: moduleInfo.relativeName,
        validator: 'overtime',
      },
    },
  };

  for (const key in behaviors) {
    const behavior = behaviors[key];
    behavior.options = {};
    if (defaults[key]) {
      behavior.options.default = defaults[key];
    }
  }

  return behaviors;
};
