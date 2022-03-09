/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 138:
/***/ ((module) => {

module.exports = ctx => {
  class FlowEdge extends ctx.app.meta.FlowEdgeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onEdgeEnter() {
      // super
      let res = await super.onEdgeEnter();
      if (!res) return false;
      // check conditionExpression
      const conditionExpression =
        this.contextEdge._edgeDef.options && this.contextEdge._edgeDef.options.conditionExpression;
      // return true on empty/null/undefined
      if (!conditionExpression && conditionExpression !== false) return true;
      if (conditionExpression === false) return false;
      // contextNodePrevious
      const contextNodePrevious = this.contextNode.contextEdge && this.contextNode.contextEdge.contextNode;
      // evaluateExpression
      res = ctx.bean.flow.evaluateExpression({
        expression: conditionExpression,
        globals: {
          context: this.context,
          contextNode: this.contextNode,
          contextEdge: this.contextEdge,
          contextNodePrevious,
        },
      });
      return !!res;
    }
  }

  return FlowEdge;
};


/***/ }),

/***/ 747:
/***/ ((module) => {

module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }
  }

  return FlowNode;
};


/***/ }),

/***/ 655:
/***/ ((module) => {

module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeDoing() {
      // super
      await super.onNodeDoing();
      // bean/parameters
      const bean = this.contextNode._nodeDef.options.bean;
      const parameterExpression = this.contextNode._nodeDef.options.parameterExpression;
      // check
      if (!bean) {
        throw new Error(
          `flow service bean is not set: flow:${this.context._flowDef.atomName}, node:${this.contextNode._nodeDef.name}`
        );
      }
      // executeService
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

/***/ 446:
/***/ ((module) => {

module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeLeave() {
      await super.onNodeLeave();
      // end
      await this.flowInstance._endFlow({
        flowHandleStatus: 1,
        flowRemark: null,
        // should not handle atom
        // atom: {
        //   close: true,
        // },
      });
      // also true
      return true;
    }
  }

  return FlowNode;
};


/***/ }),

/***/ 322:
/***/ ((module) => {

module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }
  }

  return FlowNode;
};


/***/ }),

/***/ 173:
/***/ ((module) => {

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
        await this._deleteSchedule2({ flowDefId, node });
      }
    }

    async _addSchedule({ flowDefId, node }) {
      const repeat = this._getJobRepeat(node);
      if (!repeat) return;
      if (!repeat.every && !repeat.cron) return;
      // push
      const jobName = this._getJobName(flowDefId, node);
      ctx.meta.util.queuePush({
        module: moduleInfo.relativeName,
        queueName: 'startEventTimer',
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
          expression: parameterExpression,
          globals: null,
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
      // atomDisabled
      if (flowDef.atomDisabled === 1) return false;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content) return false;
      const nodeConfig = content.process.nodes.find(item => item.id === node.id);
      if (!nodeConfig) return false;
      // check if changed
      const jobKeyActive = ctx.app.meta.queue._getRepeatKey(job.data.jobName, job.data.jobOptions.repeat);
      const jobKeyConfig = ctx.app.meta.queue._getRepeatKey(
        this._getJobName(flowDefId, nodeConfig),
        this._getJobRepeat(nodeConfig)
      );
      if (jobKeyActive !== jobKeyConfig) return false;
      // ok
      return true;
    }

    async _deleteSchedule(context) {
      const job = context.job;
      const jobKeyActive = ctx.app.meta.queue._getRepeatKey(job.data.jobName, job.data.jobOptions.repeat);
      const repeat = await job.queue.repeat;
      await repeat.removeRepeatableByKey(jobKeyActive);
    }

    async _deleteSchedule2({ flowDefId, node }) {
      const jobKeyActive = ctx.app.meta.queue._getRepeatKey(
        this._getJobName(flowDefId, node),
        this._getJobRepeat(node)
      );
      const queue = ctx.app.meta.queue._getQueue({
        module: moduleInfo.relativeName,
        queueName: 'startEventTimer',
      });
      const repeat = await queue.repeat;
      await repeat.removeRepeatableByKey(jobKeyActive);
    }

    _getJobName(flowDefId, node) {
      return `${flowDefId}.${node.id}`.replace(/:/g, '.');
    }
    _getJobRepeat(node) {
      return node.options && node.options.repeat;
    }
  }

  return FlowNode;
};


/***/ }),

/***/ 557:
/***/ ((module) => {

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

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // empty
      }
    }

    async init(options) {}

    async test() {}
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const queueStartEventTimer = __webpack_require__(557);
const flowEdgeSequence = __webpack_require__(138);
const flowNodeStartEventNone = __webpack_require__(322);
const flowNodeStartEventTimer = __webpack_require__(173);
const flowNodeEndEventNone = __webpack_require__(446);
const flowNodeActivityNone = __webpack_require__(747);
const flowNodeActivityService = __webpack_require__(655);

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

/***/ 661:
/***/ ((module) => {

module.exports = class FlowServiceBase {};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    startEventTimer: {
      bean: 'startEventTimer',
      concurrency: true,
    },
  };

  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {};


/***/ }),

/***/ 614:
/***/ ((module) => {

module.exports = {
  sequence: {
    conditionExpression: null,
  },
  startEventTimer: {
    repeat: {
      every: 0,
      cron: null,
    },
    bean: null,
    parameterExpression: null,
  },
  activityService: {
    bean: null,
    parameterExpression: null,
  },
};


/***/ }),

/***/ 719:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const defaults = __webpack_require__(614);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const edges = {
    sequence: {
      title: 'Sequence',
      bean: 'sequence',
      validator: {
        module: moduleInfo.relativeName,
        validator: 'sequence',
      },
    },
  };

  for (const key in edges) {
    const node = edges[key];
    node.options = {};
    if (defaults[key]) {
      node.options.default = defaults[key];
    }
  }

  return edges;
};


/***/ }),

/***/ 587:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const defaults = __webpack_require__(614);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const nodes = {
    // events
    startEventNone: {
      title: 'StartEventNone',
      group: 'startEvent',
      bean: 'startEventNone',
      icon: { f7: ':flow:start-event-none' },
    },
    startEventTimer: {
      title: 'StartEventTimer',
      group: 'startEvent',
      bean: 'startEventTimer',
      icon: { f7: ':flow:start-event-timer' },
      validator: {
        module: moduleInfo.relativeName,
        validator: 'startEventTimer',
      },
    },
    endEventNone: {
      title: 'EndEventNone',
      group: 'endEvent',
      bean: 'endEventNone',
      icon: { f7: ':flow:end-event-none' },
    },
    // activities
    activityNone: {
      title: 'ActivityNone',
      group: 'activity',
      bean: 'activityNone',
      icon: { f7: ':flow:activity-none' },
    },
    activityService: {
      title: 'ActivityService',
      group: 'activity',
      bean: 'activityService',
      icon: { f7: ':flow:activity-service' },
      validator: {
        module: moduleInfo.relativeName,
        validator: 'activityService',
      },
    },
  };

  for (const key in nodes) {
    const node = nodes[key];
    node.options = {};
    if (defaults[key]) {
      node.options.default = defaults[key];
    }
  }

  return nodes;
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  StartEventNone: 'StartEvent: None',
  StartEventTimer: 'StartEvent: Timer',
  EndEventNone: 'EndEvent: None',
  ActivityNone: 'Activity: None',
  ActivityService: 'Activity: Service',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  StartEventNone: '空开始事件',
  StartEventTimer: '定时开始事件',
  EndEventNone: '空结束事件',
  ActivityNone: '空活动',
  ActivityService: '服务活动',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 483:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // activityService
  schemas.activityService = {
    type: 'object',
    properties: {
      bean: {
        type: 'object',
        ebType: 'component',
        ebTitle: 'Bean',
        ebRender: {
          module: 'a-flowchart',
          name: 'renderBeanFlowService',
        },
        notEmpty: true,
      },
      parameterExpression: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Parameter Expression',
        ebParams: {
          textarea: true,
        },
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 833:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // sequence
  schemas.sequence = {
    type: 'object',
    properties: {
      conditionExpression: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Condition Expression',
        ebParams: {
          textarea: true,
        },
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 440:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // startEventTimer
  schemas.startEventTimer = {
    type: 'object',
    properties: {
      repeat: {
        type: 'object',
        ebType: 'json',
        ebTitle: 'Repeat',
        notEmpty: true,
      },
      bean: {
        type: 'object',
        ebType: 'component',
        ebTitle: 'Bean',
        ebRender: {
          module: 'a-flowchart',
          name: 'renderBeanFlowService',
        },
        notEmpty: true,
      },
      parameterExpression: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Parameter Expression',
        ebParams: {
          textarea: true,
        },
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const sequence = __webpack_require__(833);
const startEventTimer = __webpack_require__(440);
const activityService = __webpack_require__(483);

module.exports = app => {
  const schemas = {};
  // sequence
  Object.assign(schemas, sequence(app));
  // startEventTimer
  Object.assign(schemas, startEventTimer(app));
  // activityService
  Object.assign(schemas, activityService(app));
  // ok
  return schemas;
};


/***/ }),

/***/ 95:
/***/ ((module) => {

module.exports = app => {
  const controllers = {};
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);
const FlowServiceBase = __webpack_require__(661);

module.exports = app => {
  // FlowServiceBase
  app.meta.FlowServiceBase = FlowServiceBase;

  // aops
  const aops = __webpack_require__(224)(app);
  // beans
  const beans = __webpack_require__(187)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // services
  const services = __webpack_require__(214)(app);
  // models
  const models = __webpack_require__(230)(app);
  // meta
  const meta = __webpack_require__(458)(app);

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

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const schemas = __webpack_require__(232)(app);
  const flowNodes = __webpack_require__(587)(app);
  const flowEdges = __webpack_require__(719)(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {
        // sequence
        sequence: {
          schemas: 'sequence',
        },
        // startEventTimer
        startEventTimer: {
          schemas: 'startEventTimer',
        },
        // activityService
        activityService: {
          schemas: 'activityService',
        },
      },
      schemas,
    },
    flow: {
      nodes: flowNodes,
      edges: flowEdges,
    },
  };
  return meta;
};


/***/ }),

/***/ 230:
/***/ ((module) => {

module.exports = app => {
  const models = {};
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [];
  return routes;
};


/***/ }),

/***/ 214:
/***/ ((module) => {

module.exports = app => {
  const services = {};
  return services;
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(421);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map