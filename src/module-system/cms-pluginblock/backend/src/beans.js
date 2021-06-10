const cmsBlockAudio = require('./bean/cms.block.audio.js');
const cmsBlockIFrame = require('./bean/cms.block.iframe.js');

module.exports = app => {
  const beans = {
    // block
    'cms.block.audio': {
      mode: 'ctx',
      bean: cmsBlockAudio,
    },
    'cms.block.iframe': {
      mode: 'ctx',
      bean: cmsBlockIFrame,
    },
  };
  return beans;
};
