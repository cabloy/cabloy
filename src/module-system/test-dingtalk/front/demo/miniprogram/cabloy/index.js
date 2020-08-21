const Util = require('./util.js');
const Api = require('./api.js');
const Data = require('./data.js');
const Config = require('./config.js');

module.exports = function(app, options) {
  let _util;
  let _api;
  let _data;
  let _config;

  const cabloy = {
    get app() {
      return app;
    },
    get util() {
      if (!_util) {
        _util = Util(this);
      }
      return _util;
    },
    get api() {
      if (!_api) {
        _api = Api(this);
      }
      return _api;
    },
    get data() {
      if (!_data) {
        _data = Data(this);
      }
      return _data;
    },
    get config() {
      if (!_config) {
        _config = Config(this, options);
      }
      return _config;
    },
    set config(value) {
      if (!_config) {
        _config = Config(this, options);
      }
      _config = this.util.extend({}, _config, value);
    },
  };

  return cabloy;
};
