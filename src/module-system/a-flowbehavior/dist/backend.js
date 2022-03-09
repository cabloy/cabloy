/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 551:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowBehavior extends ctx.app.meta.FlowBehaviorBase {
    constructor(options) {
      super(ctx, options);
    }

    async enter(context, next) {
      // addJob
      const flowId = this.context._flowId;
      const flowNodeId = this.contextNode._flowNodeId;
      const behaviorDefId = this._behaviorDef.id;
      await this._addJob({ flowId, flowNodeId, behaviorDefId });
      // next
      return await next();
    }

    async clear(context, next) {
      // deleteJob
      const flowId = this.context._flowId;
      const flowNodeId = this.contextNode._flowNodeId;
      const behaviorDefId = this._behaviorDef.id;
      await this._deleteJob({ flowId, flowNodeId, behaviorDefId });
      // next
      return await next();
    }

    async _addJob({ flowId, flowNodeId, behaviorDefId }) {
      const options = this.nodeInstance.getBehaviorDefOptions({ behaviorDefId });
      if (!options.timeDuration && !options.timeDate) {
        // do nothing
        return;
      }
      // delay
      let delay;
      if (options.timeDuration) {
        delay = options.timeDuration;
      } else {
        delay = options.timeDate - new Date();
      }
      // push
      const jobName = this._getJobName({ flowId, flowNodeId, behaviorDefId });
      const jobId = jobName;
      ctx.meta.util.queuePush({
        module: moduleInfo.relativeName,
        queueName: 'overtime',
        queueNameSub: flowId,
        jobName,
        jobOptions: {
          delay,
          jobId,
        },
        data: {
          flowId,
          flowNodeId,
          behaviorDefId,
        },
      });
    }

    async _deleteJob({ flowId, flowNodeId, behaviorDefId }) {
      const jobId = this._getJobName({ flowId, flowNodeId, behaviorDefId });
      const queue = ctx.app.meta.queue._getQueue({
        module: moduleInfo.relativeName,
        queueName: 'overtime',
      });
      await queue.remove(jobId);
    }

    async _runJob(context) {
      const { flowNodeId, behaviorDefId } = context.data;
      // load flow node
      let nodeInstance;
      try {
        nodeInstance = await ctx.bean.flow._loadFlowNodeInstance({ flowNodeId });
      } catch (err) {}
      if (!nodeInstance) {
        // here means done, so do nothing
        return;
      }
      // options
      const options = nodeInstance.getBehaviorDefOptions({ behaviorDefId });
      if (options.cancelActivity) {
        // clear
        const remark = 'Overtime';
        await nodeInstance.clear({ flowNodeHandleStatus: 3, flowNodeRemark: remark });
      }
      // nextEdges
      await nodeInstance.flowInstance.nextEdges({
        contextNode: nodeInstance.contextNode,
        behaviorDefId,
      });
    }

    _getJobName({ flowId, flowNodeId, behaviorDefId }) {
      return `${flowId}.${flowNodeId}.${behaviorDefId}`.replace(/:/g, '.');
    }
  }

  return FlowBehavior;
};


/***/ }),

/***/ 691:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Queue extends app.meta.BeanBase {
    async execute(context) {
      const _behaviorBean = this.ctx.bean._newBean(`${moduleInfo.relativeName}.flow.behavior.overtime`);
      await _behaviorBean._runJob(context);
    }
  }

  return Queue;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {}

    async init(options) {}

    async test() {}
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const flowBehaviorOvertime = __webpack_require__(551);
const queueOvertime = __webpack_require__(691);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // flow behavior
    'flow.behavior.overtime': {
      mode: 'ctx',
      bean: flowBehaviorOvertime,
    },
    // queue
    'queue.overtime': {
      mode: 'app',
      bean: queueOvertime,
    },
  };
  return beans;
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    overtime: {
      bean: 'overtime',
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

/***/ 257:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const defaults = __webpack_require__(614);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const behaviors = {
    // Overtime
    overtime: {
      title: 'Overtime',
      bean: 'overtime',
      icon: { f7: ':outline:timer-outline' },
      validator: {
        module: moduleInfo.relativeName,
        validator: 'overtime',
      },
    },
  };

  for (const key in behaviors) {
    const behavior = behaviors[key];
    behavior.options = {};
    if (defaults[key]) {
      behavior.options.default = defaults[key];
    }
  }

  return behaviors;
};


/***/ }),

/***/ 614:
/***/ ((module) => {

module.exports = {
  overtime: {
    cancelActivity: true,
    timeDuration: 0,
    timeDate: null,
  },
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  Overtime: '超时',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 403:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // overtime
  schemas.overtime = {
    type: 'object',
    properties: {
      cancelActivity: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'OverTime_CancelActivity',
      },
      timeDuration: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'OverTime_TimeDuration',
      },
      timeDate: {
        type: ['object', 'null'],
        ebType: 'datePicker',
        ebTitle: 'OverTime_TimeDate',
        ebParams: {
          timePicker: true,
          dateFormat: 'YYYY-MM-DD HH:mm:00',
          header: false,
          toolbar: true,
        },
        'x-date': true,
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const overtime = __webpack_require__(403);

module.exports = app => {
  const schemas = {};
  // overtime
  Object.assign(schemas, overtime(app));
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

module.exports = app => {
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
  const flowBehaviors = __webpack_require__(257)(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {
        // overtime
        overtime: {
          schemas: 'overtime',
        },
      },
      schemas,
    },
    flow: {
      behaviors: flowBehaviors,
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