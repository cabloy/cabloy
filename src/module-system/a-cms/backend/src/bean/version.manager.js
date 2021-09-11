const version_0 = require('./version.manager_0.js');
const update_1 = require('./version/update_1.js');

module.exports = app => {
  const classes = [
    update_1, //
  ];
  return app.meta.util.mixinClasses(version_0, classes, app);
};
