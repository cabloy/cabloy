module.exports = app => {
  const blockAudio = require('./block/audio.js')(app);
  const blockIFrame = require('./block/iframe.js')(app);
  return {
    blockAudio,
    blockIFrame,
  };
};
