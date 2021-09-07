(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? (module.exports = factory()) : typeof define === 'function' && define.amd ? define(factory) : null;
})(this, function () {
  class Audio {
    mount() {
      return 1;
    }
  }
  return Audio;
});

// require.config({
//   paths: {
//     APlayer: 'api/static/a/markdownblock/blocks/audio/aplayer/aplayer-1.10.1.min',
//     APlayer_CSS: 'api/static/a/markdownblock/blocks/audio/aplayer/aplayer-1.10.1.min',
//   },
// });
// define(['APlayer', 'css!APlayer_CSS'], function (APlayer) {
//   console.log(APlayer);
// });
