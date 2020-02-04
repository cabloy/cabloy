const AppWorkerLoader = require('egg').AppWorkerLoader;
const loadModules = require('../module');

module.exports = class CustomAppWorkerLoader extends AppWorkerLoader {
  constructor(opt) {
    super(opt);
  }
  loadConfig() {
    super.loadConfig();
    this.app.subdomainOffset = this.config.subdomainOffset || 2;
  }
  load() {
    super.load();
    // load modules
    loadModules(this);
  }
};
