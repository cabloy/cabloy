export default {
  methods: {
    async _onActionSubmit() {
      const { ctx, action, item } = this.$props;
      // onActionSubmitBefore
      //   ctx maybe not layoutManager
      if (ctx.layout && ctx.layout.instanceExtend && ctx.layout.instanceExtend.onActionSubmitBefore) {
        await ctx.layout.instanceExtend.onActionSubmitBefore(this.$props);
      }
      // key
      const key = { atomId: item.atomId, itemId: item.itemId };
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      // dataOptions
      const dataOptions = action.dataOptions || {};
      // step one: write
      const options = {
        saveDraftOnly: false,
      };
      this.base_prepareOptionsFromDataOptions(options, dataOptions);
      await ctx.$api.post('/a/base/atom/write', { key, atomClass, item, options });
      // do
      if (dataOptions.formAction) {
        // handle form action
        await this._onActionSubmit_handleFormAction({ ctx, item, atomClass, dataOptions });
      } else if (dataOptions.flowTaskId) {
        // handle flow task
        await this._onActionSubmit_handleFlowTask({ ctx, dataOptions });
      } else {
        // submit
        await this._onActionSubmit_normal({ ctx, item, key, atomClass });
      }
    },
    async _onActionSubmit_handleFormAction({ ctx, item, atomClass, dataOptions }) {
      // form action
      const formAction = dataOptions.formAction;
      // data options
      const dataOptionsContinue = Object.assign({}, dataOptions, { formAction: undefined, formActionContinue: true });
      // action
      const useStoreAtomActions = await ctx.$store.use('a/basestore/atomActions');
      let actionBase = await useStoreAtomActions.getActionBase({ atomClass, name: formAction });
      actionBase = ctx.$utils.extend({}, actionBase, { dataOptions: dataOptionsContinue });
      return await ctx.$meta.util.performAction({ ctx, action: actionBase, item });
    },
    async _onActionSubmit_handleFlowTask({ ctx, dataOptions }) {
      const flowLayoutManager = ctx.timeline.instance;
      const tasks = flowLayoutManager.base_tasks;
      const task = tasks.find(item => item.flowTaskId === dataOptions.flowTaskId);
      const action = task._actions.find(item => item.name === 'handleTask');
      await ctx.$meta.util.performAction({
        ctx,
        action: {
          actionModule: 'a-flowtask',
          actionComponent: 'action',
          name: 'handleTaskPerform',
          options: action.options,
        },
        item: {
          flowLayoutManager,
          task,
        },
      });
    },
    async _onActionSubmit_normal({ ctx, item, key, atomClass }) {
      // step middle: confirm
      await ctx.$view.dialog.confirm(this.$text('AtomActionSubmitConfirm'));
      // step two: submit
      const data = await ctx.$api.post('/a/base/atom/submit', { key, atomClass });
      if (data.formal) {
        await this._onActionSubmit_done_formal({ ctx, item, key, atomClass, data });
      }
      // check if flow
      if (data.flow) {
        await this._onActionSubmit_done_flow({ ctx, item, key, atomClass, data });
      }
    },
    async _onActionSubmit_done_formal({ ctx, item, key, atomClass, data }) {
      // delete draft
      if (item.atomStage === 0) {
        ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action: { name: 'delete' } });
        if (item.atomIdFormal > 0) {
          // update formal
          ctx.$meta.eventHub.$emit('atom:action', {
            key: data.formal.key,
            atomClass,
            action: { name: 'save' },
            actionSource: ctx,
          });
        } else {
          // list create
          ctx.$meta.eventHub.$emit('atom:action', {
            key: data.formal.key,
            atomClass,
            action: { name: 'create' },
            atom: data.formal.atom,
          });
        }
      } else {
        // update formal
        ctx.$meta.eventHub.$emit('atom:action', {
          key: data.formal.key,
          atomClass,
          action: { name: 'save' },
          actionSource: ctx,
        });
      }
      // back
      if (!data.flow) {
        ctx.page_setDirty(false); // should before navigate
        ctx.$f7router.back();
      }
    },
    async _onActionSubmit_done_flow({ ctx, item, key, atomClass, data }) {
      // update draft
      ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action: { name: 'save' }, actionSource: ctx });
      // navigate replace self
      ctx.page_setDirty(false); // should before navigate
      // goto: /a/basefront/atom/item?mode=view
      const action = {
        actionModule: 'a-base',
        actionComponent: 'action',
        name: 'read',
        navigateOptions: {
          target: '_self',
          reloadCurrent: true,
        },
      };
      const itemAction = data.formal ? data.formal.atom : item;
      await this.$meta.util.performAction({ ctx, action, item: itemAction });
    },
    // async _onActionSubmit_done_flow_old({ ctx, /* item,*/ key, atomClass, data }) {
    //   // flow
    //   const flow = data.flow;
    //   // update draft
    //   ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action: { name: 'save' }, actionSource: ctx });
    //   // navigate replace self
    //   ctx.page_setDirty(false); // should before navigate
    //   const url = `/a/flowtask/flow?flowId=${flow.id}`;
    //   ctx.$view.navigate(url, {
    //     target: '_self',
    //     reloadCurrent: true,
    //   });
    // },
  },
};
