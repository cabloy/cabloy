export default {
  data() {
    return {};
  },
  methods: {
    async share_createLink({ capability }) {
      const res = await this.$api.post('/a/share/share/generate', {
        host: capability.host,
        atomId: this.container.atomId,
        url: this.$pageRoute.url,
      });
      return res.link;
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
        const capability = await this.$meta.util.performAction({
          ctx: this,
          action,
          item: {
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
        const title = this.base.item.atomName || '';
        const desc = this.base.item.description || this.base.item.summary || '';
        const link = await this.share_createLink({ capability });
        let imgUrl = this.base.item.imageCover || this.base.item.imageFirst;
        if (!imgUrl) {
          const configBase = this.$meta.config.modules['a-base'];
          imgUrl = this.$meta.util.combineFetchStaticPath(configBase.site.cover);
        }
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
