const path = require('path');
const egg = require('egg');
const EGG_PATH = Symbol.for('egg#eggPath');
const EGG_LOADER = Symbol.for('egg#loader');
const AppWorkerLoader = require('./load/app.js');
const AgentWorkerLoader = require('./load/agent.js');

const eggPath = path.resolve(__dirname, '../..');

class Application extends egg.Application {
  get [EGG_PATH]() {
    return eggPath;
  }
  get [EGG_LOADER]() {
    return AppWorkerLoader;
  }
}

class Agent extends egg.Agent {
  get [EGG_PATH]() {
    return eggPath;
  }
  get [EGG_LOADER]() {
    return AgentWorkerLoader;
  }
}

module.exports = Object.assign(egg, {
  Application,
  Agent,
  AppWorkerLoader,
  AgentWorkerLoader,
});
