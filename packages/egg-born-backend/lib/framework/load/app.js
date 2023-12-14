const path = require('path');
const AppWorkerLoader = require('egg').AppWorkerLoader;
const loadModules = require('../../module');
const ModuleInfoFn = require('../moduleInfo.js');

module.exports = class CustomAppWorkerLoader extends AppWorkerLoader {
  constructor(opt) {
    super(opt);
    ModuleInfoFn(this.app);
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
  getAppname() {
    if (!this.pkgCabloy) {
      this.pkgCabloy = require(path.join(process.cwd(), 'package.json'));
      this.pkg.name = this.pkgCabloy.name;
    }
    return this.pkgCabloy.name;
  }
};
