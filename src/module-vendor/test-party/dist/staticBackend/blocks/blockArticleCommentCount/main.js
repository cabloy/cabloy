(function (global, factory) {
  /* eslint-disable */
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : null;
  /* eslint-enable */
})(this, function () {
  class Block {
    constructor(host) {
      this.host = host;
      this.timerId = 0;
    }

    async render() {
      const { $util } = this.host;
      const title = $util.text('Article Comment Count');
      return `
        <div class="article-comment-count">
          <span class="title">${title}</span>
          <span class="count"></span>
          <span class="date"></span> 
        </div>`;
    }

    async mount() {
      const { $content } = this.host;
      // load css
      await this._loadCSS();
      // start timer
      const interval = $content.interval;
      this.timerId = window.setInterval(async () => {
        await this._fetchAndShow();
      }, interval);
    }

    async unmount() {
      if (this.timerId) {
        window.clearInterval(this.timerId);
        this.timerId = 0;
      }
    }

    async _fetchAndShow() {
      const { $container, $$ } = this.host;
      // count
      const valueCount = await this._getCount();
      const $count = $$('.article-comment-count .count', $container);
      $count.text(valueCount);
      // date
      const valueDate = this._getNow();
      const $date = $$('.article-comment-count .date', $container);
      $date.text(valueDate);
    }

    _loadCSS() {
      return new Promise(resolve => {
        require(['css!api/static/test/party/blocks/blockArticleCommentCount/main'], () => {
          resolve();
        });
      });
    }

    async _getCount() {
      const { $util, $host } = this.host;
      //
      const key = { atomId: $host.atomId };
      const options = {
        comment: 1,
        where: {},
      };
      return await $util.performAction({
        method: 'post',
        url: '/a/base/comment/count',
        body: {
          key,
          options,
        },
      });
    }

    _getNow() {
      const { $host } = this.host;
      if ($host.mode === 'view-cms') {
        return window.util.time.formatDateTime();
      }
      return window.Vue.prototype.$meta.util.formatDateTime();
    }
  }
  return Block;
});
