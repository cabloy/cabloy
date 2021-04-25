export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'shareLink') return await this._shareLink({ ctx, action, item });
    },
    async _get_wx({ ctx }) {
      const action = {
        actionModule: 'a-wechat',
        actionComponent: 'jssdk',
        name: 'config',
      };
      const res = await this.$meta.util.performAction({ ctx, action });
      return res && res.wx;
    },
    async _shareLink({ ctx, item }) {
      const wx = await this._get_wx({ ctx });
      if (!wx) return;
      // 分享给朋友
      wx.updateAppMessageShareData({
        title: item.title,
        desc: item.desc,
        link: item.link,
        imgUrl: item.imgUrl,
        success: item.success,
      });
      // 分享给朋友圈
      wx.updateTimelineShareData({
        title: item.title,
        link: item.link,
        imgUrl: item.imgUrl,
        success: item.success,
      });
    },
  },
};
