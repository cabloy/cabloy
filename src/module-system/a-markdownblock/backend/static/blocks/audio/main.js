(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? (module.exports = factory()) : typeof define === 'function' && define.amd ? define(factory) : null;
})(this, function () {
  class Audio {
    APlayer = null;

    mount() {
      return this._loadAPlayer().then(APlayer => {
        console.log(APlayer);
      });
    }

    _loadAPlayer() {
      if (this.APlayer) return Promise.resolve(this.APlayer);
      return new Promise(resolve => {
        require.config({
          paths: {
            APlayer: 'api/static/a/markdownblock/blocks/audio/aplayer/aplayer-1.10.1.min',
            APlayer_CSS: 'api/static/a/markdownblock/blocks/audio/aplayer/aplayer-1.10.1.min',
          },
        });
        define(['APlayer', 'css!APlayer_CSS'], APlayer => {
          this.APlayer = APlayer;
          resolve(APlayer);
        });
      });
    }
  }
  return Audio;
});
