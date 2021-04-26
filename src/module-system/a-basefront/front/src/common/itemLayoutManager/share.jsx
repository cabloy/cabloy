export default {
  data() {
    return {
    };
  },
  methods: {
    async share_createLink({ capability }) {

    },
    async share_updateLink() {
      // only stage:formal
      if (this.base.item.atomStage !== 1 || this.base_user.anonymous) return;
      try {
        // lookup
        let action = {
          actionModule: 'a-host',
          actionComponent: 'capabilities',
          name: 'lookup',
        };
        const capability = await this.$meta.util.performAction({ ctx: this, action, item: {
          name: 'shareLink',
        },
        });
        if (!capability) return;
        // action
        action = {
          actionModule: 'a-host',
          actionComponent: 'capabilities',
          name: 'invoke',
        };
        // item
        const title = this.base.item.atomName;
        const desc = this.base.item.description;
        const link = await this.share_createLink({ capability });
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
