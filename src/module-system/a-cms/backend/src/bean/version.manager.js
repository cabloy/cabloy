const version_0 = require('./version.manager_0.js');
const update_1 = require('./version/update_1.js');
const update_2 = require('./version/update_2.js');
const update_3 = require('./version/update_3.js');

module.exports = app => {
  const classes = [
    update_1, //
    update_2,
    update_3,
  ];
  return app.meta.util.mixinClasses(version_0, classes, app);
};
