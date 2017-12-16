const Model = require('./lib/base/model.js');

module.exports = app => {
  app.Model = Model(app);
};
