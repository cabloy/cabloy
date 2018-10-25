// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // plugin
  config.plugin = {
    wechatQrcodeTitle: '微信扫一扫：分享',
    wechatQrcodeHelper: '<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>',
    wechatQrcodeSize: 100,
    sites: 'wechat,weibo,qq,douban,linkedin,facebook,twitter,google',
    mobileSites: '',
    disabled: '',
  };

  return config;
};
