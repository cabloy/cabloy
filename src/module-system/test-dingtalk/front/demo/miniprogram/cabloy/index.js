const Util = require('./util.js');
const Api = require('./api.js');
const Data = require('./data.js');

module.exports = function (app, options) {
  const cabloy = {
    get app() {
      return app;
    },
  };
  cabloy.util = Util(cabloy);
  cabloy.api = Api(cabloy);
  cabloy.data = Data(cabloy, options);
  
  return cabloy;
};
