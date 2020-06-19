const _scenes = {
  wxwork: {
    scene: 'wxwork', authProvider: 'wxwork', title: 'Wechat Work', client: 'wxwork',
  },
  wxworkweb: {
    scene: 'wxworkweb', authProvider: 'wxworkweb', title: 'Wechat Work Web', client: 'wxworkweb',
  },
  wxworkmini: {
    scene: 'wxworkmini', authProvider: 'wxworkmini', title: 'Wechat Work Miniprogram',
  },
};

function _upperCaseFirstChar(str) {
  if (!str) return '';
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

module.exports = {
  scenes: _scenes,
  getScene(scene) {
    if (scene.indexOf('wxworkmini') > -1) {
      const sceneShort = scene.substr('wxworkmini'.length);
      // wxworkmini
      const base = _scenes.wxworkmini;
      return {
        scene,
        authProvider: scene,
        title: `${base.title} - ${_upperCaseFirstChar(sceneShort)}`,
      };
    }
    // else
    return _scenes[scene];
  },
};
