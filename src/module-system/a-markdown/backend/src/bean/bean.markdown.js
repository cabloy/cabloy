const path = require('path');
const require3 = require('require3');
const Markdownit = require3('@zhennann/markdown');
const markdonw_it_block = require3('@zhennann/markdown-it-block');
const uuid = require3('uuid');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
          register: ({ params, content }) => {
            const placeholder = `__markdown_block_placeholder__${uuid.v4().replace(/-/g, '')}`;
            asyncs[placeholder] = { params, content };
            return placeholder;
          },
        },
      };
      // md
      const md = Markdownit.create().use(markdonw_it_block, blockOptions);
      // render
      let html = md.render(content);
      // render async
      for (const placeholder in asyncs) {
        const { params, content } = asyncs[placeholder];
        const [module, blockName] = params.split(':');
        if (!module || !blockName) throw new Error(`Invalid Markdown Block: ${params}`);
        const _module = ctx.app.meta.modules[module];
        if (!_module) throw new Error(`Module Not Found: ${module}`);
        const block_js = path.join(_module.static.backend, `blocks/${blockName}/main.js`);
        const BlockClass = require(block_js);
        // render
        const blockHost = this._getHost({ host, content, locale });
        // Block Instance
        const blockInstance = new BlockClass(blockHost);
        let blockHtml = '';
        if (blockInstance.render) {
          blockHtml = await blockInstance.render();
        }
        // eslint-disable-next-line
        const dataContent = encodeURIComponent(JSON5.stringify(content, null, 2));
        blockHtml = `
<div class="markdown-it-cabloy-block" data-block-params="${params}" data-block-content="${dataContent}">
  ${blockHtml}
</div>
`;
        // replace
        const regexp = new RegExp(placeholder);
        html = html.replace(regexp, blockHtml);
      }
      // ok
      return html;
    }

    _getHost({ host, content, locale }) {
      const $util = ctx.bean.util.hostUtil({
        locale: locale || ctx.bean.util.getProperty(host, 'atom.atomLanguage'),
      });
      return {
        $host: host, // atomId/atom
        $content: content,
        $util,
      };
    }
  }

  return Markdown;
};
