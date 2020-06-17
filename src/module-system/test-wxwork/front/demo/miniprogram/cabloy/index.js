const Data = require('./data.js');
const Api = require('./api.js');
const Util = require('./util.js');

module.exports = function(app) {
  const cabloy = {
    get app() {
      return app;
    },
  };
  cabloy.data = Data(cabloy);
  cabloy.api = Api(cabloy);
  cabloy.util = Util(cabloy);
  return cabloy;
};
