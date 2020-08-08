
const gTestListMax = 89;

module.exports = app => {

  class PtrIsLoadMoreController extends app.Controller {

    async list() {
      // page
      let page = this.ctx.request.body.page;
      // adjust page
      page = this.ctx.meta.util.page(page, false);
      // items
      const items = [];
      for (let i = 0; i < page.size; i++) {
        const itemId = page.index + i + 1;
        if (itemId > gTestListMax) break;
        items.push({
          id: itemId,
          title: `${this.ctx.text('Item')} - ${itemId}`,
        });
      }
      // ok
      this.ctx.successMore(items, page.index, page.size);
    }

  }

  return PtrIsLoadMoreController;
};

