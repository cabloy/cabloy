const AppWorkerLoader = require('egg').AppWorkerLoader;
const loadModules = require('../module');

module.exports = class CustomAppWorkerLoader extends AppWorkerLoader {
  constructor(opt) {
    super(opt);
  }
  loadConfig() {
    super.loadConfig();
  }
  load() {
    super.load();
    // load modules
    loadModules(this);
  }
};
