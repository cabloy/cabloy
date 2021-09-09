const require3 = require('require3');
const trimHtml = require3('@zhennann/trim-html');
const Markdownit = require3('@zhennann/markdown');
const markdonw_it_block = require3('@zhennann/markdown-it-block');
const uuid = require3('uuid');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Markdown {
    async render({ host, content, locale }) {
      if (!content) return '';
      // asyncs
      const asyncs = {};
      // block options
      const blockOptions = {
        utils: {
          text: (...args) => {
            return ctx.text.locale(locale || ctx.app.config.i18n.defaultLocale, ...args);
          },
          register: ({ blockName, content }) => {
            const placeholder = `__cmsblockplaceholder__${uuid.v4().replace(/-/g, '')}`;
            asyncs[placeholder] = { blockName, content };
            return placeholder;
          },
        },
      };
      // md
      const md = Markdownit.create().use(markdonw_it_block, blockOptions);
      // render
      const html = md.render(content);
    }
  }

  return Markdown;
};
