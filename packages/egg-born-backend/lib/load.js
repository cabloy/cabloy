const AppWorkerLoader = require('egg').AppWorkerLoader;
const AgentWorkerLoader = require('egg').AgentWorkerLoader;
const loadModules = require('./module');

class CustomAppWorkerLoader extends AppWorkerLoader {
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

}

class CustomAgentWorkerLoader extends AgentWorkerLoader {
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

}

exports.AppWorkerLoader = CustomAppWorkerLoader;
exports.AgentWorkerLoader = CustomAgentWorkerLoader;
