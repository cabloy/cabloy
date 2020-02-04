const AgentWorkerLoader = require('egg').AgentWorkerLoader;
const loadModules = require('../module');

module.exports = class CustomAgentWorkerLoader extends AgentWorkerLoader {
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
