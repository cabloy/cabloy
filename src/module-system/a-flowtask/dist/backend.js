module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(1);
const locales = __webpack_require__(2);
const errors = __webpack_require__(5);
const FlowServiceBase = __webpack_require__(6);

module.exports = app => {

  // FlowServiceBase
  app.meta.FlowServiceBase = FlowServiceBase;

  // aops
  const aops = __webpack_require__(7)(app);
  // beans
  const beans = __webpack_require__(8)(app);
  // routes
  const routes = __webpack_require__(18)(app);
  // controllers
  const controllers = __webpack_require__(19)(app);
  // services
  const services = __webpack_require__(20)(app);
  // models
  const models = __webpack_require__(21)(app);
  // meta
  const meta = __webpack_require__(23)(app);

  return {
    aops,
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta,
  };

};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    startEventTimer: {
      bean: 'startEventTimer',
    },
  };

  return config;
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'en-us': __webpack_require__(3),
  'zh-cn': __webpack_require__(4),
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
  StartEventNone: 'StartEvent: None',
  StartEventTimer: 'StartEvent: Timer',
  StartEventAtom: 'StartEvent: Atom Draft',
  EndEventNone: 'EndEvent: None',
  ActivityNone: 'Activity: None',
  ActivityService: 'Activity: Service',
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = {
  StartEventNone: '空开始事件',
  StartEventTimer: '定时开始事件',
  StartEventAtom: '原子起草开始事件',
  EndEventNone: '空结束事件',
  ActivityNone: '空活动',
  ActivityService: '服务活动',
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = class FlowServiceBase {
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const versionManager = __webpack_require__(9);
const queueStartEventTimer = __webpack_require__(10);
const flowEdgeSequence = __webpack_require__(11);
const flowNodeStartEventNone = __webpack_require__(12);
const flowNodeStartEventTimer = __webpack_require__(13);
const flowNodeStartEventAtom = __webpack_require__(14);
const flowNodeEndEventNone = __webpack_require__(15);
const flowNodeActivityNone = __webpack_require__(16);
const flowNodeActivityService = __webpack_require__(17);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // queue
    'queue.startEventTimer': {
      mode: 'app',
      bean: queueStartEventTimer,
    },
    // flow
    'flow.edge.sequence': {
      mode: 'ctx',
      bean: flowEdgeSequence,
    },
    'flow.node.startEventNone': {
      mode: 'ctx',
      bean: flowNodeStartEventNone,
    },
    'flow.node.startEventTimer': {
      mode: 'ctx',
      bean: flowNodeStartEventTimer,
    },
    'flow.node.startEventAtom': {
      mode: 'ctx',
      bean: flowNodeStartEventAtom,
    },
    'flow.node.endEventNone': {
      mode: 'ctx',
      bean: flowNodeEndEventNone,
    },
    'flow.node.activityNone': {
      mode: 'ctx',
      bean: flowNodeActivityNone,
    },
    'flow.node.activityService': {
      mode: 'ctx',
      bean: flowNodeActivityService,
    },
  };
  return beans;
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = app => {
  class Version extends app.meta.BeanBase {

    async update(options) {
      if (options.version === 1) {
        // create table: aFlowNodeStartEventAtomCondition
        const sql = `
          CREATE TABLE aFlowNodeStartEventAtomCondition (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowDefId int(11) DEFAULT '0',
            startEventId varchar(255) DEFAULT NULL,
            atomClassId int(11) DEFAULT '0',
            conditionExpression TEXT DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
    }

    async test() {
    }

  }

  return Version;
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const _nodeBaseBean = this.ctx.bean._newBean(`${moduleInfo.relativeName}.flow.node.startEventTimer`);
      await _nodeBaseBean._runSchedule(context);
    }

  }

  return Queue;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = ctx => {
  class FlowEdge extends ctx.app.meta.FlowEdgeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onEdgeEnter() {
      // super
      await super.onEdgeEnter();
      // check conditionExpression
      const conditionExpression = this.contextEdge._edgeRef.options && this.contextEdge._edgeRef.options.conditionExpression;
      if (conditionExpression === undefined) return true;
      if (!conditionExpression) return false;
      const res = ctx.bean.flow.evaluateExpression({
        expression: conditionExpression,
        globals: {
          context: this.context,
          contextNode: this.contextNode,
          contextEdge: this.contextEdge,
        },
      });
      return !!res;
    }

  }

  return FlowEdge;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }
  }

  return FlowNode;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async deploy({ deploy, flowDefId, node }) {
      if (deploy) {
        await this._addSchedule({ flowDefId, node });
      } else {
        // donot delete schedule
      }
    }

    async _addSchedule({ flowDefId, node }) {
      const repeat = node.options && node.options.repeat;
      if (!repeat) return;
      // push
      const jobName = `${flowDefId}.${node.id}`;
      ctx.app.meta.queue.push({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'startEventTimer',
        queueNameSub: flowDefId,
        jobName,
        jobOptions: {
          repeat,
        },
        data: {
          flowDefId,
          node,
        },
      });
    }

    async _runSchedule(context) {
      const { flowDefId, node } = context.data;
      // ignore on test
      if (ctx.app.meta.isTest) return;
      // check if valid
      if (!(await this._checkJobValid(context))) {
        await this._deleteSchedule(context);
        return;
      }
      // bean/parameterExpression
      const bean = node.options && node.options.bean;
      const parameterExpression = node.options && node.options.parameterExpression;
      if (bean) {
        // bean
        const parameter = ctx.bean.flow.evaluateExpression({
          expression: parameterExpression, globals: null,
        });
        await ctx.bean.flow.executeService({
          bean,
          parameter: { flowDefId, node, parameter },
          globals: null,
        });
      } else {
        // start
        await ctx.bean.flow.startById({ flowDefId, startEventId: node.id });
      }
    }

    async _checkJobValid(context) {
      const job = context.job;
      const { flowDefId, node } = context.data;
      // flowDef
      const flowDef = await ctx.bean.flowDef.getById({ flowDefId });
      if (!flowDef) return false;
      // disabled
      if (flowDef.disabled) return false;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content) return false;
      const nodeConfig = content.process.nodes.find(item => item.id === node.id);
      if (!nodeConfig) return false;
      // check if changed
      const jobKeyActive = getRepeatKey(job.data.jobName, job.data.jobOptions.repeat);
      const jobKeyConfig = getRepeatKey(`${flowDefId}.${nodeConfig.id}`, nodeConfig.options && nodeConfig.options.repeat);
      if (jobKeyActive !== jobKeyConfig) return false;
      // ok
      return true;
    }

    async _deleteSchedule(context) {
      const job = context.job;
      const jobKeyActive = getRepeatKey(job.data.jobName, job.data.jobOptions.repeat);
      const repeat = await job.queue.repeat;
      await repeat.removeRepeatableByKey(jobKeyActive);
    }

  }

  return FlowNode;
};

function getRepeatKey(name, repeat) {
  const endDate = repeat.endDate ? new Date(repeat.endDate).getTime() : '';
  const tz = repeat.tz || '';
  const suffix = (repeat.cron ? repeat.cron : String(repeat.every)) || '';

  return `${name}::${endDate}:${tz}:${suffix}`;
}



/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    get modelCondition() {
      return ctx.model.module(moduleInfo.relativeName).flowNodeStartEventAtomCondition;
    }

    async deploy({ deploy, flowDefId, node }) {
      if (deploy) {
        await this._addCondition({ flowDefId, node });
      } else {
        // donot delete condition
      }
    }

    async _addCondition({ flowDefId, node }) {
      const atom = node.options && node.options.atom;
      if (!atom) throw new Error(`atom not set for startEventAtom: ${flowDefId}.${node.id}`);
      // atomClass
      const atomClass = await ctx.bean.atomClass.get({
        module: atom.module,
        atomClassName: atom.atomClassName,
        atomClassIdParent: atom.atomClassIdParent || 0,
      });
      const conditionExpression = node.options.conditionExpression;
      // get condition
      const startEventId = node.id;
      const _condition = await this.modelCondition.get({
        flowDefId, startEventId,
      });
      if (_condition) {
        // update
        _condition.atomClassId = atomClass.id;
        _condition.conditionExpression = conditionExpression;
        await this.modelCondition.update(_condition);
      } else {
        // insert
        await this.modelCondition.insert({
          flowDefId, startEventId,
          atomClassId: atomClass.id, conditionExpression,
        });
      }
    }

    async _match({ atom, userId }) {
      // order by dynamic/conditionExpression
      const list = await ctx.model.query(`
          select a.* from aFlowNodeStartEventAtomCondition a
            left join aFlowDef b on a.flowDefId=b.id
            where a.iid=? and a.atomClassId=?
            order by b.dynamic desc, a.conditionExpression desc
        `, [ ctx.instance.id, atom.atomClassId ]);
      for (const _condition of list) {
        const flowInstance = await this._matchCondition({ _condition, atom, userId });
        if (flowInstance) return flowInstance;
      }
      return null;
    }

    async _matchCondition(context) {
      const { _condition, atom, userId } = context;
      // check if valid
      if (!(await this._checkConditionValid(context))) {
        await this._deleteCondition(context);
        return null;
      }
      // match conditionExpression
      const conditionActive = _condition.conditionExpression;
      if (conditionActive) {
        const res = ctx.bean.flow.evaluateExpression({
          expression: conditionActive,
          globals: { atom },
        });
        if (!res) return null;
      }
      // start
      const flowInstance = await ctx.bean.flow.startById({
        flowDefId: _condition.flowDefId,
        startEventId: _condition.startEventId,
        flowUserId: userId,
        flowAtomId: atom.atomId,
      });
      // ok
      return flowInstance;
    }

    async _checkConditionValid(context) {
      const { _condition } = context;
      // flowDef
      const flowDef = await ctx.bean.flowDef.getById({ flowDefId: _condition.flowDefId });
      if (!flowDef) return false;
      // disabled
      if (flowDef.disabled) return false;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content) return false;
      const nodeConfig = content.process.nodes.find(item => item.id === _condition.startEventId);
      if (!nodeConfig) return false;
      // check if changed
      const conditionActive = _condition.conditionExpression;
      const conditionConfig = nodeConfig.options && nodeConfig.options.conditionExpression;
      if (conditionActive !== conditionConfig) return false;
      // ok
      return true;
    }

    async _deleteCondition(context) {
      const { _condition } = context;
      await this.modelCondition.delete({ id: _condition.id });
    }

  }

  return FlowNode;
};



/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeLeave() {
      await super.onNodeLeave();
      // end
      await this.flowInstance._endFlow();
      return false;
    }

  }

  return FlowNode;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }
  }

  return FlowNode;
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeDoing() {
      // super
      await super.onNodeDoing();
      // bean/parameters
      const bean = this.contextNode._nodeRef.options.bean;
      const parameterExpression = this.contextNode._nodeRef.options.parameterExpression;
      await ctx.bean.flow.executeService({
        bean,
        parameterExpression,
        globals: {
          context: this.context,
          contextNode: this.contextNode,
        },
      });
      // ok
      return true;
    }
  }

  return FlowNode;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = app => {
  const routes = [
  ];
  return routes;
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = app => {
  const controllers = {
  };
  return controllers;
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = app => {
  const services = {
  };
  return services;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const flowNodeStartEventAtomCondition = __webpack_require__(22);

module.exports = app => {
  const models = {
    flowNodeStartEventAtomCondition,
  };
  return models;
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = app => {
  class FlowNodeStartEventAtomCondition extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowNodeStartEventAtomCondition', options: { disableDeleted: true } });
    }
  }
  return FlowNodeStartEventAtomCondition;
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const flowNodes = __webpack_require__(24);
const flowEdges = __webpack_require__(25);

module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
    flow: {
      nodes: flowNodes,
      edges: flowEdges,
    },
  };
  return meta;
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = {
  // events
  startEventNone: {
    title: 'StartEventNone',
    group: 'startEvent',
    bean: 'startEventNone',
    icon: '/api/static/a/flownode/bpmn/events/start-event-none.svg',
  },
  startEventTimer: {
    title: 'StartEventTimer',
    group: 'startEvent',
    bean: 'startEventTimer',
    icon: '/api/static/a/flownode/bpmn/events/start-event-timer.svg',
  },
  startEventAtom: {
    title: 'StartEventAtom',
    group: 'startEvent',
    bean: 'startEventAtom',
    icon: '/api/static/a/flownode/bpmn/events/start-event-atom.svg',
  },
  endEventNone: {
    title: 'EndEventNone',
    group: 'endEvent',
    bean: 'endEventNone',
    icon: '/api/static/a/flownode/bpmn/events/end-event-none.svg',
  },
  // activities
  activityNone: {
    title: 'ActivityNone',
    group: 'activity',
    bean: 'activityNone',
    icon: '/api/static/a/flownode/bpmn/activities/activity-none.svg',
  },
  activityService: {
    title: 'ActivityService',
    group: 'activity',
    bean: 'activityService',
    icon: '/api/static/a/flownode/bpmn/activities/activity-service.svg',
  },
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = {
  sequence: {
    title: 'Sequence',
    bean: 'sequence',
  },
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map