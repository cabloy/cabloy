const path = require('path');
const AgentWorkerLoader = require('egg').AgentWorkerLoader;
const loadModules = require('../../module');
const ModuleInfoFn = require('../moduleInfo.js');

module.exports = class CustomAgentWorkerLoader extends AgentWorkerLoader {
  constructor(opt) {
    super(opt);
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'unittest') {
      ModuleInfoFn(this.app);
    }
  }
  loadConfig() {
    super.loadConfig();
    this.app.subdomainOffset = typeof this.config.subdomainOffset === 'undefined' ? 2 : this.config.subdomainOffset;
  }
  load() {
    super.load();
    // load modules
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'unittest') {
      loadModules(this);
    }
  }
  getAppname() {
    if (!this.pkgCabloy) {
      this.pkgCabloy = require(path.join(process.cwd(), 'package.json'));
      this.pkg.name = this.pkgCabloy.name;
    }
    return this.pkgCabloy.name;
  }
};
