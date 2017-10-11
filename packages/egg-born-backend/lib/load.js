/*
* @Author: zhennann
* @Date:   2017-09-15 21:40:49
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-09 23:43:28
*/


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
  }

}

exports.AppWorkerLoader = CustomAppWorkerLoader;
exports.AgentWorkerLoader = CustomAgentWorkerLoader;
