module.exports = ctx => {
  class CMSBlock {
    render({ md, options, /* block, token, index,*/ content }) {
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
    }
  }

  return CMSBlock;
};
