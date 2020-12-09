module.exports = app => {
  const blockAudio = require('./block/iframe.js')(app);
  const blockIFrame = require('./block/audio.js')(app);
  return {
    blockAudio,
    blockIFrame,
  };
};
