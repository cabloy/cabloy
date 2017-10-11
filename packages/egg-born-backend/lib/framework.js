

const path = require('path');
const egg = require('egg');
const EGG_PATH = Symbol.for('egg#eggPath');
const EGG_LOADER = Symbol.for('egg#loader');
const AppWorkerLoader = require('./load.js').AppWorkerLoader;
const AgentWorkerLoader = require('./load.js').AgentWorkerLoader;

class Application extends egg.Application {
  get [EGG_PATH]() {
    return path.dirname(__dirname);
  }
  get [EGG_LOADER]() {
    return AppWorkerLoader;
  }
}

class Agent extends egg.Agent {
  get [EGG_PATH]() {
    return path.dirname(__dirname);
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
