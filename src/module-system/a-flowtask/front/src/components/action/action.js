import Vue from 'vue';
import ActionClaim from './action/actionClaim.js';
import ActionViewAtom from './action/actionViewAtom.js';
import ActionAppendHandleRemark from './action/actionAppendHandleRemark.js';
import ActionAssigneesConfirmation from './action/actionAssigneesConfirmation.js';
import ActionCancelFlow from './action/actionCancelFlow.js';
import ActionHandleTask from './action/actionHandleTask.js';
import ActionRecall from './action/actionRecall.js';
import ActionForward from './action/actionForward.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionClaim,
    ActionViewAtom,
    ActionAppendHandleRemark,
    ActionAssigneesConfirmation,
    ActionCancelFlow,
    ActionHandleTask,
    ActionRecall,
    ActionForward,
  ],
  data() {
    return {
      flowLayoutManager: null,
      task: null,
      flowTaskId: 0,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.flowLayoutManager = this.item.flowLayoutManager;
      this.task = this.item.task;
      this.flowTaskId = this.task.flowTaskId;
    },
    async onAction() {
      const action = this.action;
      if (action.name === 'claim') {
        return await this._onActionClaim();
      } else if (action.name === 'viewAtom') {
        return await this._onActionViewAtom();
      } else if (action.name === 'assigneesConfirmation') {
        return await this._onActionAssigneesConfirmation();
      } else if (action.name === 'cancelFlow') {
        return await this._onActionCancelFlow();
      } else if (action.name === 'handleTask') {
        return await this._onActionHandleTask();
      } else if (action.name === 'recall') {
        return await this._onActionRecall();
      } else if (action.name === 'appendHandleRemark') {
        return await this._onActionAppendHandleRemark();
      } else if (action.name === 'forward') {
        return await this._onActionForward();
      }
    },
    async _ensureClaimed(checkBidding) {
      const { ctx } = this.$props;
      const { flowLayoutManager, task, flowTaskId } = this.$data;
      if (task.timeClaimed) {
        // do nothing
        return;
      }
      //
      const actionClaim = task._actions && task._actions.find(item => item.name === 'claim');
      const optionsBidding = actionClaim && actionClaim.options && actionClaim.options.bidding;
      // check bidding
      if (checkBidding && optionsBidding) {
        // do nothing
        return;
      }
      // claim
      const res = await ctx.$api.post('/a/flowtask/task/claim', {
        flowTaskId,
      });
      task.timeClaimed = res.timeClaimed;
      // bidding
      if (optionsBidding) {
        // should reload data
        await flowLayoutManager.base_loadData();
      }
    },
  },
};
