export default {
  methods: {
    async _onActionViewAtom() {
      const { ctx } = this.$props;
      // ensure claim
      await this._ensureClaimed(true);
      // load schema and item
      if (!this.task._viewAtomData) {
        const data = await ctx.$api.post('/a/flowtask/task/viewAtom', {
          flowTaskId: this.flowTaskId,
        });
        this.$set(this.task, '_viewAtomData', data);
      }
      // navigate
      const url = `/a/flowtask/flowTaskAtom?flowTaskId=${this.flowTaskId}&mode=view`;
      ctx.$view.navigate(url, {
        context: {
          params: {
            flowLayoutManager: this.flowLayoutManager,
            task: this.task,
            data: this.task._viewAtomData,
          },
        },
      });
    },
  },
};
