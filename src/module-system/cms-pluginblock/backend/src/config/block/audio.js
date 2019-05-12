module.exports = {
  meta: {
    name: 'audio',
    title: 'Audio',
    validator: 'blockAudio',
  },
  data: {
    default: {
      audio: {
        name: '',
        url: '',
        artist: '',
        cover: '',
      },
      autoplay: false,
      loop: true,
    },
    // async output({ ctx, block, data }) {
    //   return data;
    // },
  },
  render({ md, options, block, token, index, content }) {
    content = content || {};
    content.audio = content.audio || {};
    const content2 = {
      audio: {
        name: md.utils.escapeHtml(content.audio.name),
        url: md.utils.escapeHtml(content.audio.url),
        artist: md.utils.escapeHtml(content.audio.artist),
        cover: md.utils.escapeHtml(content.audio.cover),
      },
      autoplay: !!content.autoplay,
      loop: content.loop ? 'all' : 'none',
    };
    // element
    return `<div class="block block-audio block-audio-aplayer">
    <script type="text/template" class="template">
    ${JSON.stringify(content2, null, 2)}
    </script>
    <div class="aplayer"></div></div>
    `;
  },
};
