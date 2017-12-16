const ModelClass = require('./lib/base/model.js');

module.exports = app => {
  app.Model = ModelClass(app);
};
