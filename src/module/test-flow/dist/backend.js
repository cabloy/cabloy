/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 915:
/***/ ((module) => {

module.exports = app => {

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // add product
      const res = await this.ctx.model.product.insert({
        atomId: key.atomId,
      });
      // return key
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update product
      const data = await this.ctx.model.product.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.product.update(data);
    }

    async delete({ atomClass, key, user }) {
      // delete product
      await this.ctx.model.product.delete({
        id: key.itemId,
      });
      // super
      await super.delete({ atomClass, key, user });
    }

    _getMeta(item) {
      // flags
      const flags = [];
      const price = (item.productPrice / 100).toFixed(2);
      flags.push(price);
      // meta
      const meta = {
        summary: item.productCode,
        flags,
      };
      // ok
      item._meta = meta;
    }

  }

  return Atom;
};


/***/ }),

/***/ 211:
/***/ ((module) => {

module.exports = app => {

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // add purchaseOrder
      const res = await this.ctx.model.purchaseOrder.insert({
        atomId: key.atomId,
      });
      // return key
      return { atomId: key.atomId, itemId: res.insertId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update purchaseOrder
      const data = await this.ctx.model.purchaseOrder.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.purchaseOrder.update(data);
    }

    async delete({ atomClass, key, user }) {
      // delete purchaseOrder
      await this.ctx.model.purchaseOrder.delete({
        id: key.itemId,
      });
      // super
      await super.delete({ atomClass, key, user });
    }

    _getMeta(item) {
      // flags
      const flags = [];
      if (item.detailsCount > 0) {
        flags.push(item.detailsCount);
      }
      const detailsAmount = (item.detailsAmount / 100).toFixed(2);
      flags.push(detailsAmount);
      // meta
      const meta = {
        flags,
      };
      // ok
      item._meta = meta;
    }

  }

  return Atom;
};


/***/ }),

/***/ 760:
/***/ ((module) => {

module.exports = app => {

  class Detail extends app.meta.DetailBase {

    async create({ atomKey, detailClass, item, user }) {
      // super
      const key = await super.create({ atomKey, detailClass, item, user });
      // add purchaseOrder detail
      const res = await this.ctx.model.purchaseOrderDetail.insert({
        atomId: atomKey.atomId,
        detailId: key.detailId,
      });
      // return key
      return { detailId: key.detailId, detailItemId: res.insertId };
    }

    async read({ detailClass, options, key, user }) {
      // super
      const item = await super.read({ detailClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item);
      // ok
      return item;
    }

    async select({ atomKey, detailClass, options, items, user }) {
      // super
      await super.select({ atomKey, detailClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item);
      }
    }

    async write({ detailClass, target, key, item, options, user }) {
      // super
      await super.write({ detailClass, target, key, item, options, user });
      // update purchaseOrder detail
      const data = await this.ctx.model.purchaseOrderDetail.prepareData(item);
      data.id = key.detailItemId;
      // update
      await this.ctx.model.purchaseOrderDetail.update(data);
    }

    async delete({ detailClass, target, key, user }) {
      // delete purchaseOrder detail
      await this.ctx.model.purchaseOrderDetail.delete({
        id: key.detailItemId,
      });
      // super
      await super.delete({ detailClass, target, key, user });
    }

    _getMeta(item) {
      // flags
      const flags = [];
      if (item.quantity > 1) {
        flags.push(item.quantity);
      }
      const amount = (item.amount / 100).toFixed(2);
      flags.push(amount);
      // meta
      const meta = {
        summary: item.detailCode,
        flags,
      };
      // ok
      item._meta = meta;
    }

  }

  return Detail;
};


/***/ }),

/***/ 416:
/***/ ((module) => {

module.exports = ctx => {
  class FlowService extends ctx.app.meta.FlowServiceBase {
    async execute(context) {
      // parameter
      const { flowDefId, parameter, node } = context.parameter;
      // start
      await ctx.bean.flow.startById({
        flowDefId,
        flowVars: parameter,
        flowUserId: 1,
        startEventId: node.id,
      });
    }
  }
  return FlowService;
};


/***/ }),

/***/ 966:
/***/ ((module) => {

module.exports = ctx => {
  class FlowService extends ctx.app.meta.FlowServiceBase {
    async execute(context) {
      // parameter
      const parameter = context.parameter;
      // set var
      context.contextNode.vars.set('echo', parameter);
      // return
      return parameter;
    }
  }
  return FlowService;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {

    async update(options) {
      if (options.version === 1) {
        // create table: testFlowPurchaseOrder
        const sql = `
          CREATE TABLE testFlowPurchaseOrder (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            description varchar(255) DEFAULT NULL,
            _flowDefKey varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 2) {
        // create table: testFlowProduct
        let sql = `
          CREATE TABLE testFlowProduct (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            productCode varchar(50) DEFAULT NULL,
            productPrice int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: testFlowPurchaseOrderDetail
        sql = `
          CREATE TABLE testFlowPurchaseOrderDetail (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            detailId int(11) DEFAULT '0',
            price int(11) DEFAULT '0',
            quantity int(11) DEFAULT '0',
            amount int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // alter table: testFlowPurchaseOrder
        sql = `
          ALTER TABLE testFlowPurchaseOrder
            ADD COLUMN detailsCount int(11) DEFAULT '0',
            ADD COLUMN detailsAmount int(11) DEFAULT '0'
        `;
        await this.ctx.model.query(sql);

      }
    }

    async init(options) {
      if (options.version === 1) {
        // add role rights
        const roleRights = [
          { roleName: 'authenticated', action: 'create' },
          { roleName: 'authenticated', action: 'read', scopeNames: 0 },
          { roleName: 'authenticated', action: 'write', scopeNames: 0 },
          { roleName: 'authenticated', action: 'delete', scopeNames: 0 },
          { roleName: 'authenticated', action: 'clone', scopeNames: 0 },
          { roleName: 'authenticated', action: 'deleteBulk' },
          { roleName: 'authenticated', action: 'exportBulk' },
          { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'purchaseOrder', roleRights });
      }
      if (options.version === 2) {
        // add role rights
        const roleRights = [
          { roleName: 'authenticated', action: 'create' },
          { roleName: 'authenticated', action: 'read', scopeNames: 0 },
          { roleName: 'authenticated', action: 'write', scopeNames: 0 },
          { roleName: 'authenticated', action: 'delete', scopeNames: 0 },
          { roleName: 'authenticated', action: 'clone', scopeNames: 0 },
          { roleName: 'authenticated', action: 'deleteBulk' },
          { roleName: 'authenticated', action: 'exportBulk' },
          { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'product', roleRights });
      }
    }

    async test() {
    }

  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const atomPurchaseOrder = __webpack_require__(211);
const atomProduct = __webpack_require__(915);
const detailPurchaseOrder = __webpack_require__(760);
const flowServiceTest = __webpack_require__(966);
const flowServiceStartEventTimer = __webpack_require__(416);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.purchaseOrder': {
      mode: 'app',
      bean: atomPurchaseOrder,
    },
    'atom.product': {
      mode: 'app',
      bean: atomProduct,
    },
    // detail
    'detail.purchaseOrder': {
      mode: 'app',
      bean: detailPurchaseOrder,
    },
    // flow
    'flow.service.test': {
      title: 'Test',
      mode: 'ctx',
      bean: flowServiceTest,
    },
    'flow.service.startEventTimer': {
      title: 'StartTestFlow',
      mode: 'ctx',
      bean: flowServiceStartEventTimer,
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
  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  StartTestFlow: 'Start Test Flow',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  Product: '产品',
  'Create Product': '新建产品',
  'Product List': '产品列表',
  'Purchase Order': '采购订单',
  'Create Purchase Order': '新建采购订单',
  'Purchase Order List': '采购订单列表',
  'Product Code Exists': '产品编码已存在',
  'WorkFlow Test': '工作流测试',
  Test_Set00_Simple: '测试_分组00_简单流程',
  StartTestFlow: '启动测试工作流',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 295:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const assert = require3('assert');

module.exports = class Listener {
  constructor(context) {
    this.context = context;
  }

  async onNodeBegin(contextNode) {
    if (contextNode._nodeDef.id === 'activity_1') {
      this.context.vars.set('echo', 'hello');
    }
  }

  async onNodeDoing(contextNode) {
    if (contextNode._nodeDef.id === 'activity_2') {
      // execute activity service
      const res = await contextNode.utils.executeService({
        bean: {
          module: 'test-flow',
          name: 'test',
        },
        parameter: 'hello world',
      });
      assert.equal(res, 'hello world');
    }
  }

  async onNodeEnd(contextNode) {
    if (contextNode._nodeDef.id === 'activity_1') {
      const echo = contextNode.vars.get('echo');
      assert.equal(echo, 'hello');
    }
  }

};


/***/ }),

/***/ 770:
/***/ ((module) => {

module.exports = class Listener {
  constructor(context) {
    this.context = context;
  }

  async onNodeEnter(contextNode) {
    if (contextNode._nodeDef.id === 'startEvent_1') {
      // nodeVars
      const x = this.context.vars.get('x');
      contextNode.vars.set('x', x);
    }
  }

};


/***/ }),

/***/ 526:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const assert = require3('assert');

module.exports = class Listener {
  constructor(context) {
    this.context = context;
  }

  async onFlowStart(options) {
    console.log('onFlowStart: ', options.startEventId);
    // flowVars
    const xyz = this.context.vars.get('x.y.z');
    assert.equal(xyz, undefined);
    this.context.vars.set('x.y.z', 'flow');
  }

  async onFlowEnd(options) {
    console.log('onFlowEnd: ', options && options.flowRemark);
    // flowVars
    const xyz = this.context.vars.get('x.y.z');
    assert.equal(xyz, 'flow');
  }

  async onNodeEnter(contextNode) {
    console.log('onNodeEnter: ', contextNode._nodeDef.id);
    // nodeVars
    const xyz = contextNode.vars.get('x.y.z');
    assert.equal(xyz, undefined);
    contextNode.vars.set('x.y.z', contextNode._nodeDef.id);
  }

  async onNodeBegin(contextNode) {
    console.log('onNodeBegin: ', contextNode._nodeDef.id);
  }

  async onNodeDoing(contextNode) {
    console.log('onNodeDoing: ', contextNode._nodeDef.id);
  }

  async onNodeEnd(contextNode) {
    console.log('onNodeEnd: ', contextNode._nodeDef.id);
  }

  async onNodeLeave(contextNode) {
    console.log('onNodeLeave: ', contextNode._nodeDef.id);
    // nodeVars
    const xyz = contextNode.vars.get('x.y.z');
    assert.equal(xyz, contextNode._nodeDef.id);
  }

  async onEdgeEnter(contextEdge, contextNode) {
    console.log('onEdgeEnter: ', contextEdge._edgeDef.id, ' from node: ', contextNode._nodeDef.id);
  }

  async onEdgeTake(contextEdge, contextNode) {
    console.log('onEdgeTake: ', contextEdge._edgeDef.id, ' from node: ', contextNode._nodeDef.id);
  }

  async onEdgeLeave(contextEdge, contextNode) {
    console.log('onEdgeLeave: ', contextEdge._edgeDef.id, ' from node: ', contextNode._nodeDef.id);
  }

  getNodeDefOptions(contextNode /* { options }*/) {
    console.log('getNodeDefOptions: ', contextNode._nodeDef.id);
  }

};


/***/ }),

/***/ 12:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const assert = require3('assert');

module.exports = class Listener {
  constructor(context) {
    this.context = context;
  }

  async onNodeEnter(contextNode) {
    if (contextNode._nodeDef.id === 'startEvent_1') {
      const _flowDefKey = this.context.atom._flowDefKey;
      assert.equal(_flowDefKey, 'set01_atomUserTask');
    }
  }

  async onTaskCreated(contextTask, contextNode) {
    console.log('onTaskCreated: ', contextTask._flowTaskId, ' of node: ', contextNode._nodeDef.id);
  }

  async onTaskClaimed(contextTask, contextNode) {
    console.log('onTaskClaimed: ', contextTask._flowTaskId, ' of node: ', contextNode._nodeDef.id);
  }

  async onTaskCompleted(contextTask, contextNode) {
    console.log('onTaskCompleted: ', contextTask._flowTaskId, ' of node: ', contextNode._nodeDef.id);
    console.log('handleStatus: %d, handleRemark: %s', contextTask._flowTask.handleStatus, contextTask._flowTask.handleRemark);
  }

  async getSchemaRead(contextTask, contextNode/* { schemaBase, schema }*/) {
    console.log('getSchemaRead: ', contextTask._flowTaskId, ' of node: ', contextNode._nodeDef.id);
  }

  async getSchemaWrite(contextTask, contextNode/* { schemaBase, schema }*/) {
    console.log('getSchemaWrite: ', contextTask._flowTaskId, ' of node: ', contextNode._nodeDef.id);
  }

  getNodeDefOptions(contextNode /* { options }*/) {
    console.log('getNodeDefOptions: ', contextNode._nodeDef.id);
  }

};


/***/ }),

/***/ 463:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const assert = require3('assert');

module.exports = class Listener {
  constructor(context) {
    this.context = context;
  }

  async onNodeEnter(contextNode) {
    if (contextNode._nodeDef.id === 'startEvent_1') {
      const _flowDefKey = this.context.atom._flowDefKey;
      assert.equal(_flowDefKey, 'set01_startEventAtom');
    }
  }

};


/***/ }),

/***/ 897:
/***/ ((module) => {

module.exports = app => {
  const content = {
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Start',
          type: 'startEventNone',
        },
        {
          id: 'activity_1',
          name: 'ActivityNone',
          type: 'activityNone',
        },
        {
          id: 'endEvent_1',
          name: 'End',
          type: 'endEventNone',
        },
      ],
      edges: [
        {
          id: 'edge_1',
          source: 'startEvent_1',
          target: 'activity_1',
        },
        {
          id: 'edge_2',
          source: 'activity_1',
          target: 'endEvent_1',
        },
      ],
    },
  };
  const definition = {
    atomName: 'Test_Set00_Activity_None',
    atomStaticKey: 'set00_activityNone',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};


/***/ }),

/***/ 725:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Listener = __webpack_require__(295);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    listener: Listener.toString(),
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Start',
          type: 'startEventNone',
        },
        {
          id: 'activity_1',
          name: 'ActivityService',
          type: 'activityService',
          options: {
            bean: {
              module: moduleInfo.relativeName,
              name: 'test',
            },
            parameterExpression: 'context.vars.get(\`echo\`)',
          },
        },
        {
          id: 'activity_2',
          name: 'ActivityNone',
          type: 'activityNone',
        },
        {
          id: 'endEvent_1',
          name: 'End',
          type: 'endEventNone',
        },
      ],
      edges: [
        {
          id: 'edge_1',
          source: 'startEvent_1',
          target: 'activity_1',
        },
        {
          id: 'edge_2',
          source: 'activity_1',
          target: 'activity_2',
        },
        {
          id: 'edge_3',
          source: 'activity_2',
          target: 'endEvent_1',
        },
      ],
    },
  };
  const definition = {
    atomName: 'Test_Set00_Activity_Service',
    atomStaticKey: 'set00_activityService',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};


/***/ }),

/***/ 949:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Listener = __webpack_require__(770);

module.exports = app => {
  const content = {
    listener: Listener.toString(),
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Start',
          type: 'startEventNone',
        },
        {
          id: 'endEvent_1',
          name: 'End',
          type: 'endEventNone',
        },
        {
          id: 'endEvent_2',
          name: 'End',
          type: 'endEventNone',
        },
      ],
      edges: [
        {
          id: 'edge_1',
          name: 'x=1',
          source: 'startEvent_1',
          target: 'endEvent_1',
          options: {
            conditionExpression: 'context.vars.get(\'x\')===1',
          },
        },
        {
          id: 'edge_2',
          name: 'x=2',
          source: 'startEvent_1',
          target: 'endEvent_2',
          options: {
            conditionExpression: `
              const x=contextNode.vars.get('x');
              x===2;
            `,
          },
        },
      ],
    },
  };
  const definition = {
    atomName: 'Test_Set00_Edge_Sequence',
    atomStaticKey: 'set00_edgeSequence',
    atomRevision: 1,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};


/***/ }),

/***/ 514:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Listener = __webpack_require__(526);

module.exports = app => {
  const content = {
    listener: Listener.toString(),
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Start',
          type: 'startEventNone',
        },
        {
          id: 'endEvent_1',
          name: 'End',
          type: 'endEventNone',
        },
      ],
      edges: [
        {
          id: 'edge_1',
          source: 'startEvent_1',
          target: 'endEvent_1',
        },
      ],
    },
  };
  const definition = {
    atomName: 'Test_Set00_Simple',
    atomStaticKey: 'set00_simple',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};


/***/ }),

/***/ 39:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    listener: null,
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Drafting',
          type: 'startEventAtom',
          options: {
            atom: {
              module: moduleInfo.relativeName,
              atomClassName: 'purchaseOrder',
            },
            conditionExpression: 'atom._flowDefKey===\'set01_atomAssigneesConfirmation\'',
          },
        },
        {
          id: 'activity_1',
          name: 'Review',
          type: 'activityUserTask',
          options: {
            assignees: {
              roles: 'family',
            },
            confirmation: true,
            bidding: true,
          },
        },
        {
          id: 'endEvent_1',
          name: 'End',
          type: 'endEventAtom',
        },
      ],
      edges: [
        {
          id: 'edge_1',
          source: 'startEvent_1',
          target: 'activity_1',
        },
        {
          id: 'edge_2',
          source: 'activity_1',
          target: 'endEvent_1',
        },
      ],
    },
  };
  const definition = {
    atomName: 'Test_Set01_Atom_AssigneesConfirmation',
    atomStaticKey: 'set01_atomAssigneesConfirmation',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};


/***/ }),

/***/ 780:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Listener = __webpack_require__(12);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    listener: Listener.toString(),
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Drafting',
          type: 'startEventAtom',
          options: {
            atom: {
              module: moduleInfo.relativeName,
              atomClassName: 'purchaseOrder',
            },
            conditionExpression: 'atom._flowDefKey===\'set01_atomUserTask\'',
          },
        },
        {
          id: 'activity_1',
          name: 'Review',
          type: 'activityUserTask',
          options: {
            assignees: {
              // users: '1,2',
              // roles: '1,2',
              vars: 'flowUser',
            },
            confirmation: false,
            bidding: false,
            completionCondition: {
              // passed: 1,
              // rejected: '100%',
            },
            // rejectedNode:null,
            // allowRejectTask: true,
            // allowCancelFlow: false,
            schema: {
              write: [
                'atomName',
                {
                  name: 'description',
                  property: {
                    type: 'string',
                    ebType: 'text',
                    ebTitle: 'Description',
                  },
                },
              ],
            },
          },
        },
        {
          id: 'endEvent_1',
          name: 'End',
          type: 'endEventAtom',
        },
      ],
      edges: [
        {
          id: 'edge_1',
          source: 'startEvent_1',
          target: 'activity_1',
        },
        {
          id: 'edge_2',
          source: 'activity_1',
          target: 'endEvent_1',
        },
      ],
    },
  };
  const definition = {
    atomName: 'Test_Set01_Atom_UserTask',
    atomStaticKey: 'set01_atomUserTask',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};


/***/ }),

/***/ 371:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Listener = __webpack_require__(463);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    listener: Listener.toString(),
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Drafting',
          type: 'startEventAtom',
          options: {
            atom: {
              module: moduleInfo.relativeName,
              atomClassName: 'purchaseOrder',
            },
            conditionExpression: 'atom._flowDefKey===\'set01_startEventAtom\'',
          },
        },
        {
          id: 'activity_1',
          name: 'ActivityNone',
          type: 'activityNone',
        },
        {
          id: 'endEvent_1',
          name: 'End',
          type: 'endEventAtom',
        },
      ],
      edges: [
        {
          id: 'edge_1',
          source: 'startEvent_1',
          target: 'activity_1',
        },
        {
          id: 'edge_2',
          source: 'activity_1',
          target: 'endEvent_1',
        },
      ],
    },
  };
  const definition = {
    atomName: 'Test_Set01_StartEvent_Atom',
    atomStaticKey: 'set01_startEventAtom',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};


/***/ }),

/***/ 772:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const set00_simple = __webpack_require__(514);
const set00_edgeSequence = __webpack_require__(949);
const set00_activityNone = __webpack_require__(897);
const set00_activityService = __webpack_require__(725);
// const set00_startEventTimer = require('./flowDef/set00_startEventTimer.js');
const set01_startEventAtom = __webpack_require__(371);
const set01_atomUserTask = __webpack_require__(780);
const set01_atomAssigneesConfirmation = __webpack_require__(39);

module.exports = app => {
  const flowDefs = [
    set00_simple(app),
    set00_edgeSequence(app),
    set00_activityNone(app),
    set00_activityService(app),
    //  set00_startEventTimer(app),
    set01_startEventAtom(app),
    set01_atomUserTask(app),
    set01_atomAssigneesConfirmation(app),
  ];
  return flowDefs;
};


/***/ }),

/***/ 728:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const products = [
    // Apple
    {
      atomName: 'Apple',
      atomStaticKey: 'apple',
      atomRevision: 0,
      productCode: 'test-001',
      productPrice: 1200,
    },
    // Pear
    {
      atomName: 'Pear',
      atomStaticKey: 'pear',
      atomRevision: 0,
      productCode: 'test-002',
      productPrice: 1000,
    },
    // Banana
    {
      atomName: 'Banana',
      atomStaticKey: 'banana',
      atomRevision: 0,
      productCode: 'test-003',
      productPrice: 1300,
    },
  ];
  return products;
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu: purchase order
    {
      atomName: 'Create Purchase Order',
      atomStaticKey: 'createPurchaseOrder',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'purchaseOrder',
        atomAction: 'create',
      }),
      resourceRoles: 'authenticated',
    },
    {
      atomName: 'Purchase Order List',
      atomStaticKey: 'listPurchaseOrder',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'purchaseOrder',
        atomAction: 'read',
      }),
      resourceRoles: 'authenticated',
    },
    // menu: product
    {
      atomName: 'Create Product',
      atomStaticKey: 'createProduct',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'product',
        atomAction: 'create',
      }),
      resourceRoles: 'authenticated',
    },
    {
      atomName: 'Product List',
      atomStaticKey: 'listProduct',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'product',
        atomAction: 'read',
      }),
      resourceRoles: 'authenticated',
    },
  ];
  return resources;
};


/***/ }),

/***/ 415:
/***/ ((module) => {

module.exports = app => {
  const keywords = {};
  keywords.productCode = {
    async: true,
    type: 'string',
    errors: true,
    compile() {
      return async function(data/* , path, rootData , name*/) {
        // ignore if empty
        if (!data) return true;
        // ctx
        const ctx = this;
        // validateHost
        if (!ctx.meta || !ctx.meta.validateHost) {
          // not check
          return true;
        }
        const atomId = ctx.meta.validateHost.key.atomId;
        const item = await ctx.model.queryOne(`
          select a.id from aAtom a
            left join testFlowProduct b on a.id=b.atomId
              where a.atomStage=0 and a.iid=? and a.deleted=0 and b.productCode=?
          `, [ ctx.instance.id, data ]);
        if (item && item.id !== atomId) {
          const errors = [{ keyword: 'x-productCode', params: [], message: ctx.text('Product Code Exists') }];
          throw new app.meta.ajv.ValidationError(errors);
        }
        return true;
      };
    },
  };
  return keywords;
};


/***/ }),

/***/ 837:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // product
  schemas.product = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Product Name',
        notEmpty: true,
      },
      productCode: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Product Code',
        notEmpty: true,
        'x-productCode': true,
      },
      productPrice: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Product Price',
        ebCurrency: true,
        // notEmpty: true,
      },
    },
  };
  // product
  schemas.productSearch = {
    type: 'object',
    properties: {
      productCode: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Product Code',
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 317:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // purchase order
  schemas.purchaseOrder = {
    type: 'object',
    properties: {
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
      _flowDefKey: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Flow Definition',
        ebOptionsBlankAuto: true,
        ebOptions: [
          { title: 'Test_Set01_StartEvent_Atom', value: 'set01_startEventAtom' },
          { title: 'Test_Set01_Atom_UserTask', value: 'set01_atomUserTask' },
          { title: 'Test_Set01_Atom_AssigneesConfirmation', value: 'set01_atomAssigneesConfirmation' },
        ],
        notEmpty: true,
      },
      // Stats
      __groupStats: {
        ebType: 'group-flatten',
        ebTitle: 'Stats',
      },
      detailsCount: {
        type: 'number',
        ebType: 'detailsStat',
        ebTitle: 'Quantity',
        ebParams: {
          detailClass: {
            module: moduleInfo.relativeName,
            detailClassName: 'default',
          },
          expression: 'details.length',
        },
        ebReadOnly: true,
      },
      detailsAmount: {
        type: 'number',
        ebType: 'detailsStat',
        ebTitle: 'Amount',
        ebParams: {
          detailClass: {
            module: moduleInfo.relativeName,
            detailClassName: 'default',
          },
          expression: 'details.reduce(function(a,b){return a+b.amount;},0)',
        },
        ebAutoSubmit: true,
        ebCurrency: true,
        ebReadOnly: true,
      },
      // Details
      __groupDetails: {
        ebType: 'group-flatten',
        ebTitle: 'Details',
        ebGroupWhole: true,
        ebParams: {
          titleHidden: true,
        },
      },
      details: {
        ebType: 'details',
        ebTitle: 'Details',
        ebParams: {
          detailClass: {
            module: moduleInfo.relativeName,
            detailClassName: 'default',
          },
        },
      },
      // __groupDetails2: {
      //   ebType: 'group-flatten',
      //   ebTitle: 'Details',
      //   ebGroupWhole: true,
      //   ebParams: {
      //     titleHidden: true,
      //   },
      // },
      // details_2: {
      //   ebType: 'details',
      //   ebTitle: 'Details 2',
      //   ebParams: {
      //     detailClass: {
      //       module: moduleInfo.relativeName,
      //       detailClassName: 'default',
      //     },
      //   },
      // },
    },
  };
  // purchase order search
  schemas.purchaseOrderSearch = {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 267:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // detail
  const __atomParams = {
    target: '_self',
    atomClass: {
      module: 'test-flow',
      atomClassName: 'product',
    },
    selectOptions: {},
    atomId: 'detailCodeId',
    mapper: {
      detailCodeId: 'atomId',
      detailCode: 'productCode',
      detailName: 'atomName',
      price: 'productPrice',
    },
  };
  const __display = {
    expression: '!!detailCodeId',
    dependencies: [ 'detailCodeId' ],
    // host: {
    //   mode: 'edit', // view
    // },
  };
  schemas.purchaseOrderDetail = {
    type: 'object',
    properties: {
      detailCodeId: {
        type: 'number',
      },
      detailCode: {
        type: 'string',
        ebType: 'atom',
        ebTitle: 'Product Code',
        ebParams: __atomParams,
        notEmpty: true,
      },
      detailName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Product Name',
        notEmpty: true,
        ebDisplay: __display,
      },
      price: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Price',
        ebCurrency: true,
        ebDisplay: __display,
      },
      quantity: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Quantity',
        ebDisplay: __display,
      },
      amount: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Amount',
        ebComputed: {
          expression: 'price * quantity',
          dependencies: 'price,quantity',
        },
        ebCurrency: true,
        ebReadOnly: true,
        ebDisplay: __display,
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const product = __webpack_require__(837);
const purchaseOrder = __webpack_require__(317);
const purchaseOrderDetail = __webpack_require__(267);

module.exports = app => {
  const schemas = {};
  // product
  Object.assign(schemas, product(app));
  // purchase order
  Object.assign(schemas, purchaseOrder(app));
  // purchase order detail
  Object.assign(schemas, purchaseOrderDetail(app));
  // ok
  return schemas;
};


/***/ }),

/***/ 623:
/***/ ((module) => {

module.exports = app => {

  class FlowController extends app.Controller {

    async start() {
      // start
      await this.ctx.bean.flow.startByKey({
        flowDefKey: this.ctx.request.body.flowDefKey,
        flowVars: this.ctx.request.body.flowVars,
        flowUserId: this.ctx.state.user.op.id,
      });
      this.ctx.success();
    }

  }

  return FlowController;
};



/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flow = __webpack_require__(623);

module.exports = app => {
  const controllers = {
    flow,
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

const require3 = __webpack_require__(718);
const extend = require3('extend2');

module.exports = app => {
  const meta = {
  };
  const keywords = __webpack_require__(415)(app);
  const schemas = __webpack_require__(232)(app);
  const staticFlowDefs = __webpack_require__(772)(app);
  const staticResources = __webpack_require__(429)(app);
  const staticProducts = __webpack_require__(728)(app);
  // meta
  extend(true, meta, {
    base: {
      atoms: {
        purchaseOrder: {
          info: {
            bean: 'purchaseOrder',
            title: 'Purchase Order',
            tableName: 'testFlowPurchaseOrder',
            details: [ 'default' ],
          },
          actions: {
          },
          validator: 'purchaseOrder',
          search: {
            validator: 'purchaseOrderSearch',
          },
        },
        product: {
          info: {
            bean: 'product',
            title: 'Product',
            tableName: 'testFlowProduct',
          },
          actions: {
          },
          validator: 'product',
          search: {
            validator: 'productSearch',
          },
        },
      },
      statics: {
        'a-flow.flowDef': {
          items: staticFlowDefs,
        },
        'a-base.resource': {
          items: staticResources,
        },
        'test-flow.product': {
          items: staticProducts,
        },
      },
    },
    detail: {
      details: {
        default: {
          info: {
            bean: 'purchaseOrder',
            title: 'Details',
            tableName: 'testFlowPurchaseOrderDetail',
          },
          actions: {
          },
          validator: 'purchaseOrderDetail',
        },
      },
    },
    validation: {
      validators: {
        // purchaseOrder
        purchaseOrder: {
          schemas: 'purchaseOrder',
        },
        purchaseOrderSearch: {
          schemas: 'purchaseOrderSearch',
        },
        // product
        product: {
          schemas: 'product',
        },
        productSearch: {
          schemas: 'productSearch',
        },
        // purchaseOrderDetail
        purchaseOrderDetail: {
          schemas: 'purchaseOrderDetail',
        },
      },
      keywords: {
        'x-productCode': keywords.productCode,
      },
      schemas,
    },
    index: {
      indexes: {
        testFlowProduct: 'createdAt,updatedAt,atomId,productCode',
        testFlowPurchaseOrder: 'createdAt,updatedAt,atomId',
        testFlowPurchaseOrderDetail: 'createdAt,updatedAt,atomId,detailId',
      },
    },
  });
  return meta;
};


/***/ }),

/***/ 499:
/***/ ((module) => {

module.exports = app => {
  class Product extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'testFlowProduct', options: { disableDeleted: false } });
    }
  }
  return Product;
};


/***/ }),

/***/ 241:
/***/ ((module) => {

module.exports = app => {
  class PurchaseOrder extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'testFlowPurchaseOrder', options: { disableDeleted: false } });
    }
  }
  return PurchaseOrder;
};


/***/ }),

/***/ 171:
/***/ ((module) => {

module.exports = app => {
  class PurchaseOrderDetail extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'testFlowPurchaseOrderDetail', options: { disableDeleted: false } });
    }
  }
  return PurchaseOrderDetail;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const product = __webpack_require__(499);
const purchaseOrder = __webpack_require__(241);
const purchaseOrderDetail = __webpack_require__(171);

module.exports = app => {
  const models = {
    product,
    purchaseOrder,
    purchaseOrderDetail,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  let routes = [
  ];
  routes = routes.concat([
    // flow/start
    { method: 'post', path: 'flow/start', controller: 'flow', middlewares: 'test' },
  ]);
  return routes;
};


/***/ }),

/***/ 214:
/***/ ((module) => {

module.exports = app => {
  const services = {
  };
  return services;
};


/***/ }),

/***/ 718:
/***/ ((module) => {

"use strict";
module.exports = require("require3");;

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