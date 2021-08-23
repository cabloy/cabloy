require.config({
  paths: {
    APlayer: 'api/static/a/markdownblock/blocks/audio/aplayer/aplayer-1.10.1.min',
    APlayer_CSS: 'api/static/a/markdownblock/blocks/audio/aplayer/aplayer-1.10.1.min',
  },
});
define(['APlayer', 'css!APlayer_CSS'], function (APlayer) {});
