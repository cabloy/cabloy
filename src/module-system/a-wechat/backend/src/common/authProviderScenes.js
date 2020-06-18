const _scenes = [
  { scene: 1, authProvider: 'wechat', title: 'Wechat Public', client: 'wechat', configKey: 'public' },
  { scene: 2, authProvider: 'wechatmini', title: 'Wechat Miniprogram', configKey: 'mini' },
  { scene: 3, authProvider: 'wechatweb', title: 'Wechat Web', client: 'wechatweb', configKey: 'web' },
];
module.exports = {
  scenes: _scenes,
  getScene(scene) {
    return _scenes.find(item => item.scene === scene);
  },
};
