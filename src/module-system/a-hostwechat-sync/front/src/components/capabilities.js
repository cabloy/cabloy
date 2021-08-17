export default {
  meta: {
    global: false,
  },
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
  methods: {
    async onAction() {
      if (this.action.name === 'shareLink') return await this._shareLink();
    },
    async _get_wx() {
      const { ctx } = this.$props;
      const action = {
        actionModule: 'a-wechat',
        actionComponent: 'jssdk',
        name: 'config',
      };
      const res = await this.$meta.util.performAction({ ctx, action });
      return res && res.wx;
    },
    async _shareLink() {
      const { item } = this.$props;
      const wx = await this._get_wx();
      if (!wx) return;
      // 分享给朋友
      wx.updateAppMessageShareData({
        title: item.title,
        desc: item.desc,
        link: item.link,
        imgUrl: item.imgUrl,
        // success: item.success,
      });
      // 分享给朋友圈
      wx.updateTimelineShareData({
        title: item.title,
        link: item.link,
        imgUrl: item.imgUrl,
        // success: item.success,
      });
    },
  },
};
