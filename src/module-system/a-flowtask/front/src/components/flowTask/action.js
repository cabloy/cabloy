export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      const task = item.task;
      if (action.name === 'viewAtom') {
        // load schema and item
        const data = await ctx.$api.post('/a/flowtask/task/viewAtom', {
          flowTaskId: task.flowTaskId,
        });

      }
    },
  },
};
