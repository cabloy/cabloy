const AgentWorkerLoader = require('egg').AgentWorkerLoader;
const loadSchedules = require('../module/schedule/agent.js');
const loadModules = require('../module');

module.exports = class CustomAgentWorkerLoader extends AgentWorkerLoader {
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
