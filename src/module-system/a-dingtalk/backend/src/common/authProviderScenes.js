const _scenes = {
  dingtalk: {},
  dingtalkweb: {},
  dingtalkadmin: {},
  dingtalkmini: {
    scene: 'dingtalkmini',
    authProvider: 'dingtalkmini',
    title: 'DingTalk Miniprogram',
  },
};

function _upperCaseFirstChar(str) {
  if (!str) return '';
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

module.exports = {
  scenes: _scenes,
  getScene(scene) {
    if (scene.indexOf('dingtalkmini') > -1) {
      const sceneShort = scene.substr('dingtalkmini'.length);
      // dingtalkmini
      const base = _scenes.dingtalkmini;
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
