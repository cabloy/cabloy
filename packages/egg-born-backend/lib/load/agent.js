const AgentWorkerLoader = require('egg').AgentWorkerLoader;
const loadModules = require('../module');

module.exports = class CustomAgentWorkerLoader extends AgentWorkerLoader {
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
