const path = require('path');
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
      console.log(html);
      // render async
      for (const placeholder in asyncs) {
        const { params, content } = asyncs[placeholder];
        const [module, blockName] = params.split(':');
        if (!module || !blockName) throw new Error(`Invalid Markdown Block: ${params}`);
        const _module = ctx.app.meta.modules[module];
        const block_js = path.join(_module.static.backend, `blocks/${blockName}/main.js`);
        const BlockClass = require(block_js);
        // render
        const host = this._getHost();
        // Block Instance
        const blockInstance = new BlockClass(host);
        let blockHtml = '';
        if (blockInstance.render) {
          blockHtml = await blockInstance.render();
        }
        blockHtml = `
<div class="markdown-it-cabloy-block" data-block-params="${params}" data-block-content="${encodeURIComponent(content)}">
  ${blockHtml}
</div>
`;
        // replace
        const regexp = new RegExp(placeholder);
        html = html.replace(regexp, blockHtml);
      }
      // ok
      console.log(html);
      return html;
    }

    _getHost({ host, content }) {
      const $util = this.ctx.$meta.util.hostUtil({
        locale: this.ctx.$meta.util.getProperty(this.ctx.host2, 'atom.atomLanguage'),
      });
      return {
        $host: this.ctx.host2, // atomId/atom
        $container: this.blockContainer,
        $content: window.JSON5.parse(this.node.attrs.content),
        $util,
      };
    }
  }

  return Markdown;
};
