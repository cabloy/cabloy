const version_0 = require('./version.manager_0.js');
const update_1 = require('./version/update_1.js');
const update_2 = require('./version/update_2.js');
const update_3 = require('./version/update_3.js');
const update_4 = require('./version/update_4.js');
const update_5 = require('./version/update_5.js');
const update_6 = require('./version/update_6.js');
const update_7 = require('./version/update_7.js');
const update_8 = require('./version/update_8.js');
const update_9 = require('./version/update_9.js');
const update_10 = require('./version/update_10.js');
const update_11 = require('./version/update_11.js');
const update_12 = require('./version/update_12.js');
const init_1 = require('./version/init_1.js');
const init_12 = require('./version/init_12.js');
const test = require('./version/test.js');

module.exports = app => {
  const classes = [
    update_1, //
    update_2,
    update_3,
    update_4,
    update_5,
    update_6,
    update_7,
    update_8,
    update_9,
    update_10,
    update_11,
    update_12,
    init_1,
    init_12,
    test,
  ];
  return app.meta.util.mixinClasses(version_0, classes, app);
};
