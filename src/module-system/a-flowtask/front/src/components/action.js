import Vue from 'vue';
export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      const task = item.task;
      const flowTaskId = task.flowTaskId;
      if (action.name === 'viewAtom') {
        // load schema and item
        if (!task._viewAtomData) {
          const data = await ctx.$api.post('/a/flowtask/task/viewAtom', {
            flowTaskId,
          });
          Vue.set(task, '_viewAtomData', data);
        }
        // navigate
        ctx.$view.navigate(`/a/flowtask/flowTaskAtom?flowTaskId=${flowTaskId}&mode=view`, {
          context: {
            params: {
              flowLayoutManager: ctx,
            },
          },
        });
      }
    },
  },
};
