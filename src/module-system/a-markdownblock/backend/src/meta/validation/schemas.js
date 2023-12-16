const schemas = {};
// block iframe
schemas.blockIFrame = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'URL',
      format: 'uri',
      notEmpty: true,
    },
    width: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Width',
    },
    height: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Height',
    },
  },
};
// block audio
schemas.blockAudio = {
  type: 'object',
  properties: {
    // audio
    audio: {
      type: 'object',
      ebType: 'group',
      ebTitle: 'Audio',
      properties: {
        name: {
          type: 'string',
          ebType: 'text',
          ebTitle: 'Name',
          notEmpty: true,
        },
        url: {
          type: 'string',
          ebType: 'file',
          ebTitle: 'URL',
          ebParams: { mode: 3 },
          format: 'uri',
          notEmpty: true,
        },
        artist: {
          type: 'string',
          ebType: 'text',
          ebTitle: 'Artist',
        },
        cover: {
          type: 'string',
          ebType: 'image',
          ebTitle: 'AudioCover',
        },
      },
    },
    // options
    __groupOptions: {
      ebType: 'group-flatten',
      ebTitle: 'Options',
    },
    autoplay: {
      type: 'boolean',
      ebType: 'toggle',
      ebTitle: 'Auto Play',
    },
    loop: {
      type: 'boolean',
      ebType: 'toggle',
      ebTitle: 'Loop',
    },
  },
};

module.exports = schemas;
