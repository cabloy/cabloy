export default {
  methods: {
    async _onActionHandleTask() {
      const { ctx, action } = this.$props;
      const { flowLayoutManager, task, flowTaskId } = this.$data;
      // ensure claim
      await this._ensureClaimed();
      // load schema and item
      if (task._editAtomData === undefined) {
        const data = await ctx.$api.post('/a/flowtask/task/editAtom', {
          flowTaskId,
        });
        this.$set(task, '_editAtomData', data);
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
      const url = `/a/flowtask/flowTaskAtom?flowTaskId=${flowTaskId}&mode=edit`;
      ctx.$view.navigate(url, navigateOptions);
    },
  },
};
