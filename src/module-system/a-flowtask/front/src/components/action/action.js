import ActionViewAtom from './action/actionViewAtom.js';
import ActionAssigneesConfirmation from './action/actionAssigneesConfirmation.js';
import ActionCancelFlow from './action/actionCancelFlow.js';
import ActionHandleTask from './action/actionHandleTask.js';
import ActionRecall from './action/actionRecall.js';

export default {
  meta: {
    global: false,
  },
  mixins: [
    ActionViewAtom, //
    ActionAssigneesConfirmation,
    ActionCancelFlow,
    ActionHandleTask,
    ActionRecall,
  ],
  props: {
    ctx: {
      type: Object,
    },
    action: {
      type: Object,
    },
    item: {
      type: Object,
    },
  },
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
      if (action.name === 'viewAtom') {
        return await this._onActionViewAtom();
      } else if (action.name === 'assigneesConfirmation') {
        return await this._onActionAssigneesConfirmation();
      } else if (action.name === 'cancelFlow') {
        return await this._onActionCancelFlow();
      } else if (action.name === 'handleTask') {
        return await this._onActionHandleTask();
      } else if (action.name === 'recall') {
        return await this._onActionRecall();
      }
    },
  },
};
