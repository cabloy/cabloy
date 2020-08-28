const _scenes = {
  wxwork: {
    scene: 'wxwork', authProvider: 'wxwork', title: 'Wechat Work', client: 'wxwork', disableAssociate: false,
  },
  wxworkweb: {
    scene: 'wxworkweb', authProvider: 'wxworkweb', title: 'Wechat Work Web', client: 'wxworkweb', disableAssociate: false,
  },
  wxworkmini: {
    scene: 'wxworkmini', authProvider: 'wxworkmini', title: 'Wechat Work Miniprogram', disableAssociate: true,
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
