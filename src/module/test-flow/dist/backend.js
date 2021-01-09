module.exports =
/** ****/ (() => { // webpackBootstrap
    /** ****/ 	const __webpack_modules__ = ({

      /***/ 224:
      /***/ module => {

        module.exports = app => {
          const aops = {};
          return aops;
        };


        /***/ },

      /***/ 211:
      /***/ module => {

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
              // ok
              return item;
            }

            async select({ atomClass, options, items, user }) {
              // super
              await super.select({ atomClass, options, items, user });
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

          }

          return Atom;
        };


        /***/ },

      /***/ 416:
      /***/ module => {

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


        /***/ },

      /***/ 966:
      /***/ module => {

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


        /***/ },

      /***/ 899:
      /***/ module => {

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
            }

            async test() {
            }

          }

          return Version;
        };


        /***/ },

      /***/ 187:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

        const versionManager = __webpack_require__(899);
        const atomPurchaseOrder = __webpack_require__(211);
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
            // flow
            'flow.service.test': {
              mode: 'ctx',
              bean: flowServiceTest,
            },
            'flow.service.startEventTimer': {
              mode: 'ctx',
              bean: flowServiceStartEventTimer,
            },
          };
          return beans;
        };


        /***/ },

      /***/ 76:
      /***/ module => {

        // eslint-disable-next-line
module.exports = appInfo => {
          const config = {};
          return config;
        };


        /***/ },

      /***/ 624:
      /***/ module => {

        // error code should start from 1001
        module.exports = {
        };


        /***/ },

      /***/ 72:
      /***/ module => {

        module.exports = {
          'Purchase Order': '采购订单',
          'Create Purchase Order': '新建采购订单',
          'Purchase Order List': '采购订单列表',
          Test_Set00_Simple: '测试_分组00_简单流程',
        };


        /***/ },

      /***/ 25:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

        module.exports = {
          'zh-cn': __webpack_require__(72),
        };


        /***/ },

      /***/ 295:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

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


        /***/ },

      /***/ 770:
      /***/ module => {

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


        /***/ },

      /***/ 526:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

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


        /***/ },

      /***/ 12:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

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

          async getSchemaWrite(contextTask, contextNode/* { schemaBase, schema }*/) {
            console.log('getSchemaWrite: ', contextTask._flowTaskId, ' of node: ', contextNode._nodeDef.id);
          }

          getNodeDefOptions(contextNode /* { options }*/) {
            console.log('getNodeDefOptions: ', contextNode._nodeDef.id);
          }

        };


        /***/ },

      /***/ 463:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

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


        /***/ },

      /***/ 897:
      /***/ module => {

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


        /***/ },

      /***/ 725:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

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


        /***/ },

      /***/ 949:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

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
                  source: 'startEvent_1',
                  target: 'endEvent_1',
                  options: {
                    conditionExpression: 'context.vars.get(\'x\')===1',
                  },
                },
                {
                  id: 'edge_2',
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
            atomRevision: 0,
            description: '',
            content: JSON.stringify(content),
          };
          return definition;
        };


        /***/ },

      /***/ 514:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

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


        /***/ },

      /***/ 39:
      /***/ module => {

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
            atomName: 'Test_Set01_Atom_AssigneesConfirmation',
            atomStaticKey: 'set01_atomAssigneesConfirmation',
            atomRevision: 0,
            description: '',
            content: JSON.stringify(content),
          };
          return definition;
        };


        /***/ },

      /***/ 780:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

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
            atomName: 'Test_Set01_Atom_UserTask',
            atomStaticKey: 'set01_atomUserTask',
            atomRevision: 0,
            description: '',
            content: JSON.stringify(content),
          };
          return definition;
        };


        /***/ },

      /***/ 371:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

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
            atomName: 'Test_Set01_StartEvent_Atom',
            atomStaticKey: 'set01_startEventAtom',
            atomRevision: 0,
            description: '',
            content: JSON.stringify(content),
          };
          return definition;
        };


        /***/ },

      /***/ 772:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

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


        /***/ },

      /***/ 429:
      /***/ module => {

        module.exports = app => {
          const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
          const resources = [
            // menu
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
          ];
          return resources;
        };


        /***/ },

      /***/ 232:
      /***/ module => {

        module.exports = app => {
          const schemas = {};
          // purchase order
          schemas.purchaseOrder = {
            type: 'object',
            properties: {
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
              },
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


        /***/ },

      /***/ 623:
      /***/ module => {

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


        /***/ },

      /***/ 95:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

        const flow = __webpack_require__(623);

        module.exports = app => {
          const controllers = {
            flow,
          };
          return controllers;
        };


        /***/ },

      /***/ 421:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

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


        /***/ },

      /***/ 458:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

        const require3 = __webpack_require__(718);
        const extend = require3('extend2');

        module.exports = app => {
          const meta = {
          };
          if (app.meta.isTest || app.meta.isLocal) {
            const schemas = __webpack_require__(232)(app);
            const staticFlowDefs = __webpack_require__(772)(app);
            const staticResources = __webpack_require__(429)(app);
            // meta
            extend(true, meta, {
              base: {
                atoms: {
                  purchaseOrder: {
                    info: {
                      bean: 'purchaseOrder',
                      title: 'Purchase Order',
                      tableName: 'testFlowPurchaseOrder',
                    },
                    actions: {
                    },
                    validator: 'purchaseOrder',
                    search: {
                      validator: 'purchaseOrderSearch',
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
                },
              },
              validation: {
                validators: {
                  purchaseOrder: {
                    schemas: 'purchaseOrder',
                  },
                  purchaseOrderSearch: {
                    schemas: 'purchaseOrderSearch',
                  },
                },
                keywords: {},
                schemas: {
                  purchaseOrder: schemas.purchaseOrder,
                  purchaseOrderSearch: schemas.purchaseOrderSearch,
                },
              },
            });
          }
          return meta;
        };


        /***/ },

      /***/ 241:
      /***/ module => {

        module.exports = app => {
          class PurchaseOrder extends app.meta.Model {
            constructor(ctx) {
              super(ctx, { table: 'testFlowPurchaseOrder', options: { disableDeleted: false } });
            }
          }
          return PurchaseOrder;
        };


        /***/ },

      /***/ 230:
      /***/ (module, __unused_webpack_exports, __webpack_require__) => {

        const purchaseOrder = __webpack_require__(241);

        module.exports = app => {
          const models = {
            purchaseOrder,
          };
          return models;
        };


        /***/ },

      /***/ 825:
      /***/ module => {

        module.exports = app => {
          let routes = [
          ];
          if (app.meta.isTest || app.meta.isLocal) {
            routes = routes.concat([
              // flow/start
              { method: 'post', path: 'flow/start', controller: 'flow' /* , middlewares: 'test' */ },
            ]);
          }
          return routes;
        };


        /***/ },

      /***/ 214:
      /***/ module => {

        module.exports = app => {
          const services = {
          };
          return services;
        };


        /***/ },

      /***/ 718:
      /***/ module => {


        module.exports = require('require3');

        /***/ },

      /** ****/ 	});
    /** **********************************************************************/
    /** ****/ 	// The module cache
    /** ****/ 	const __webpack_module_cache__ = {};
    /** ****/
    /** ****/ 	// The require function
    /** ****/ 	function __webpack_require__(moduleId) {
      /** ****/ 		// Check if module is in cache
      /** ****/ 		if (__webpack_module_cache__[moduleId]) {
        /** ****/ 			return __webpack_module_cache__[moduleId].exports;
        /** ****/ 		}
      /** ****/ 		// Create a new module (and put it into the cache)
      /** ****/ 		const module = __webpack_module_cache__[moduleId] = {
        /** ****/ 			// no module.id needed
        /** ****/ 			// no module.loaded needed
        /** ****/ 			exports: {},
        /** ****/ 		};
      /** ****/
      /** ****/ 		// Execute the module function
      /** ****/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
      /** ****/
      /** ****/ 		// Return the exports of the module
      /** ****/ 		return module.exports;
      /** ****/ 	}
    /** ****/
    /** **********************************************************************/
    /** ****/ 	// module exports must be returned from runtime so entry inlining is disabled
    /** ****/ 	// startup
    /** ****/ 	// Load entry module and return exports
    /** ****/ 	return __webpack_require__(421);
    /** ****/ })()
;
// # sourceMappingURL=backend.js.map
