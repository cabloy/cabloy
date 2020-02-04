const AppWorkerLoader = require('egg').AppWorkerLoader;
const loadModules = require('../module');

module.exports = class CustomAppWorkerLoader extends AppWorkerLoader {
  constructor(opt) {
    super(opt);
  }
  loadConfig() {
    super.loadConfig();
    this.app.subdomainOffset = typeof this.config.subdomainOffset === 'undefined' ? 2 : this.config.subdomainOffset;
  }
  load() {
    super.load();
    // load modules
    loadModules(this);
  }
};
