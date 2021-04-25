export default {
  data() {
    return {
    };
  },
  methods: {
    async share_updateLink() {
      // only stage:formal
      if (this.base.item.atomStage !== 1) return;
      try {
        // action
        const action = {
          actionModule: 'a-host',
          actionComponent: 'capabilities',
          name: 'invoke',
        };
        // item
        const title = this.base.item.atomName;
        const desc = this.base.item.description;
        const link = '';
        const imgUrl = this.base.item.imageFirst;
        const item = {
          name: 'shareLink',
          options: {
            title,
            desc,
            link,
            imgUrl,
            success: () => {
              this.$view.toast.show({ text: this.$text('SharingCompleted') });
            },
          },
        };
        await this.$meta.util.performAction({ ctx: this, action, item });
      } catch (err) {
        // do nothing
      }
    },
  },
};
