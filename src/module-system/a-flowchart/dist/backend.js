/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};
  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  return schemas;
};


/***/ }),

/***/ 623:
/***/ ((module) => {

module.exports = app => {
  class FlowDefController extends app.Controller {
    async flowChartProcess() {
      const { host } = this.ctx.request.body;
      const user = this.ctx.state.user.op;
      const res = await this.ctx.service.flow.flowChartProcess({
        host,
        user,
      });
      this.ctx.success(res);
    }
  }
  return FlowDefController;
};


/***/ }),

/***/ 836:
/***/ ((module) => {

module.exports = app => {
  class FlowDefController extends app.Controller {
    async normalizeAssignees() {
      const { host, assignees } = this.ctx.request.body;
      const user = this.ctx.state.user.op;
      const res = await this.ctx.service.flowDef.normalizeAssignees({
        host,
        assignees,
        user,
      });
      this.ctx.success(res);
    }

    async userSelect() {
      const { host, params } = this.ctx.request.body;
      const user = this.ctx.state.user.op;
      const page = params.page;
      const items = await this.ctx.service.flowDef.userSelect({
        host,
        params,
        user,
      });
      this.ctx.successMore(items, page.index, page.size);
    }
  }
  return FlowDefController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flow = __webpack_require__(623);
const flowDef = __webpack_require__(836);

module.exports = app => {
  const controllers = {
    flow,
    flowDef,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

module.exports = app => {
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
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {},
      keywords: {},
      schemas: {},
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
  const routes = [
    // flow
    { method: 'post', path: 'flow/flowChartProcess', controller: 'flow' },
    // flowDef
    { method: 'post', path: 'flowDef/normalizeAssignees', controller: 'flowDef' },
    { method: 'post', path: 'flowDef/userSelect', controller: 'flowDef' },
  ];
  return routes;
};


/***/ }),

/***/ 934:
/***/ ((module) => {

module.exports = app => {
  class Flow extends app.Service {
    async flowChartProcess({ host, user }) {
      // check right
      const flowChartProcess = await this.__checkRightFlowChartProcess({ host, user });
      if (!flowChartProcess) this.ctx.throw(403);
      // filter options / locale
      if (flowChartProcess.nodes) {
        flowChartProcess.nodes = flowChartProcess.nodes.map(node => {
          return {
            ...node,
            options: undefined,
            nameLocale: this.ctx.text(node.name),
          };
        });
      }
      if (flowChartProcess.edges) {
        flowChartProcess.edges = flowChartProcess.edges.map(edge => {
          return {
            ...edge,
            options: undefined,
          };
        });
      }
      // ok
      return flowChartProcess;
    }

    async __checkRightFlowChartProcess({ host, user }) {
      const { flowId } = host;
      // check right
      let flow = await this.ctx.bean.flow.get({ flowId, history: true, user });
      if (!flow) return null;
      // get flow
      flow = await this.ctx.bean.flow.modelFlowHistory.get({ flowId });
      if (!flow) return null;
      // flowDef
      const flowDef = await this.ctx.bean.flowDef.getByKeyAndRevision({
        flowDefKey: flow.flowDefKey,
        flowDefRevision: flow.flowDefRevision,
      });
      if (!flowDef) return null;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content) return null;
      // ok
      return content.process;
    }
  }
  return Flow;
};


/***/ }),

/***/ 875:
/***/ ((module) => {

module.exports = app => {
  class FlowDef extends app.Service {
    async normalizeAssignees({ host, assignees, user }) {
      // check right
      assignees = await this.__checkRightNormalizeAssignees({ host, assignees, user });
      if (!assignees) this.ctx.throw(403);
      //  normalize
      return await this.ctx.bean.flow.normalizeAssignees(assignees);
    }

    async userSelect({ host, params, user }) {
      // check write right
      const rightWrite = await this.__checkRightWrite({ host, user });
      if (!rightWrite) this.ctx.throw(403);
      // users
      return await this.ctx.bean.user.selectGeneral({ params, user });
    }

    async __checkRightWrite({ host, user }) {
      const { flowDefId } = host;
      return await this.ctx.bean.atom.checkRightAction({
        atom: { id: flowDefId },
        action: 3,
        stage: 'draft',
        user,
        checkFlow: true,
      });
    }

    async __checkRightRead({ host, user }) {
      const { flowDefId } = host;
      return await this.ctx.bean.atom.checkRightRead({
        atom: { id: flowDefId },
        user,
        checkFlow: true,
      });
    }

    async __checkRightNormalizeAssignees({ host, assignees, user }) {
      const { flowDefId, nodeDefId } = host;
      // check write right
      const rightWrite = await this.__checkRightWrite({ host, user });
      if (rightWrite) return assignees;
      // check read right
      const rightRead = await this.__checkRightRead({ host, user });
      // no right
      if (!rightRead) return null;
      // get assignees from flowDef
      const flowDef = await this.ctx.bean.flowDef.getById({ flowDefId });
      if (!flowDef) return null;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content) return null;
      // find
      const node = content.process.nodes.find(item => item.id === nodeDefId);
      if (!node) return null;
      // ok
      return node.options.task ? node.options.task.assignees : node.options.assignees;
    }
  }
  return FlowDef;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flow = __webpack_require__(934);
const flowDef = __webpack_require__(875);

module.exports = app => {
  const services = {
    flow,
    flowDef,
  };
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