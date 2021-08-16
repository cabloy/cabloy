import ActionViewAtom from './action/actionViewAtom.js';
import ActionAssigneesConfirmation from './action/actionAssigneesConfirmation.js';

export default {
  meta: {
    global: false,
  },
  mixins: [
    ActionViewAtom, //
    ActionAssigneesConfirmation,
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
        return await this._cancelFlow({ ctx, action, flowLayoutManager, task, flowTaskId });
      } else if (action.name === 'handleTask') {
        return await this._handleTask({ ctx, action, flowLayoutManager, task, flowTaskId });
      } else if (action.name === 'recall') {
        return await this._recall({ ctx, action, flowLayoutManager, task, flowTaskId });
      }
    },
    async _handleTask({ ctx, action, flowLayoutManager, task, flowTaskId }) {
      // claim first
      if (!task.timeClaimed) {
        const res = await ctx.$api.post('/a/flowtask/task/claim', {
          flowTaskId,
        });
        task.timeClaimed = res.timeClaimed;
      }
      // load schema and item
      if (task._editAtomData === undefined) {
        const data = await ctx.$api.post('/a/flowtask/task/editAtom', {
          flowTaskId,
        });
        Vue.set(task, '_editAtomData', data);
      }
      if (!task._editAtomData) {
        // handle directly
        ctx.$refs.actionHandleTask.open({
          flowLayoutManager,
          flowTaskId,
          action,
          callback: null,
        });
        return;
      }
      // navigate options
      const navigateOptions = {
        context: {
          params: {
            flowLayoutManager,
            task,
            data: task._editAtomData,
            action,
          },
        },
      };
      if (ctx.$pageRoute.path === '/a/flowtask/flowTaskAtom') {
        navigateOptions.target = '_self';
        navigateOptions.reloadCurrent = true;
      }
      // navigate
      ctx.$view.navigate(`/a/flowtask/flowTaskAtom?flowTaskId=${flowTaskId}&mode=edit`, navigateOptions);
    },
    async _recall({ ctx, flowLayoutManager, flowTaskId }) {
      await ctx.$view.dialog.confirm(ctx.$text('RecallPrompt'));
      await ctx.$api.post('/a/flowtask/task/recall', {
        flowTaskId,
      });
      await flowLayoutManager.base_loadData();
    },
    async _cancelFlow({ ctx, flowLayoutManager, flowTaskId }) {
      ctx.$refs.actionCancelFlow.open({ flowLayoutManager, flowTaskId });
    },
  },
};
