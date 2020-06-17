const _scenes = [
  { scene: 1, authProvider: 'wxwork', title: 'Wechat Work', client: 'wxwork' },
  { scene: 2, authProvider: 'wxworkMini', title: 'Wechat Work Miniprogram' },
  { scene: 3, authProvider: 'wxworkweb', title: 'Wechat Work Web', client: 'wxworkweb' },
];
module.exports = {
  scenes: _scenes,
  getScene(scene) {
    return _scenes.find(item => item.scene === scene);
  },
};
