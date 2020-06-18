const _scenes = [
  { scene: 1, authProvider: 'wechat', title: 'Wechat', client: 'wechat' },
  { scene: 2, authProvider: 'wechatmini', title: 'Wechat Miniprogram' },
  { scene: 3, authProvider: 'wechatweb', title: 'Wechat Web', client: 'wechatweb' },
];
module.exports = {
  scenes: _scenes,
  getScene(scene) {
    return _scenes.find(item => item.scene === scene);
  },
};
