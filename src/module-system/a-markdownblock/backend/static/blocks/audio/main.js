(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? (module.exports = factory()) : typeof define === 'function' && define.amd ? define(factory) : null;
})(this, function () {
  class Audio {
    constructor(host) {
      this.host = host;
      this.APlayer = null;
      this.playerInstance = null;
    }

    async render() {
      const atomId = this.host.atomId;
      return '<div class="aplayer"></div>';
    }

    mount() {
      const { $container, $content, $util } = this.host;
      return this._loadAPlayer().then(APlayer => {
        const $player = $container.querySelector('.aplayer');
        // content
        if (!$content.audio) return;
        $content.container = $player;
        $content.autoplay = !!$content.autoplay;
        $content.loop = $content.loop ? 'all' : 'none';
        // audio
        if (!Array.isArray($content.audio)) {
          $content.audio = [$content.audio];
        }
        for (const audio of $content.audio) {
          audio.name = $util.escapeHtml(audio.name);
          audio.url = $util.escapeURL(audio.url);
          audio.artist = $util.escapeHtml(audio.artist);
          audio.cover = $util.escapeURL(audio.cover);
          if (!audio.cover) audio.cover = $util.url('api/static/a/base/img/audio_cover.jpg');
        }
        // create
        this.playerInstance = new APlayer($content);
      });
    }

    unmount() {
      if (this.playerInstance) {
        this.playerInstance.destroy();
        this.playerInstance = null;
      }
    }

    _loadAPlayer() {
      if (this.APlayer) return Promise.resolve(this.APlayer);
      return new Promise(resolve => {
        require.config({
          paths: {
            APlayer: 'api/static/a/markdownblock/blocks/audio/aplayer/aplayer-1.10.1.min',
            APlayer_CSS: 'api/static/a/markdownblock/blocks/audio/aplayer/aplayer-1.10.1.min',
            AudioMain_CSS: 'api/static/a/markdownblock/blocks/audio/main',
          },
        });
        require(['APlayer', 'css!APlayer_CSS', 'css!AudioMain_CSS'], APlayer => {
          this.APlayer = APlayer;
          resolve(APlayer);
        });
      });
    }
  }
  return Audio;
});
