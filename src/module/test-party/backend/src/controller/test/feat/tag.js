const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class TagController extends app.Controller {

    async tag() {

      // atomClass
      const atomClass = {
        module: 'test-party',
        atomClassName: 'party',
      };

      // add
      const tagId = await this.ctx.bean.tag.add({
        atomClass,
        data: {
          // language: 'en-us', // neednot set language
          tagName: 'tagOne',
        },
      });
      assert(tagId > 0);

      // parseTags: 'tagOne,tagTwo,tagThree'
      const tagIds = await this.ctx.bean.tag.parseTags({
        atomClass,
        // language: 'en-us',// neednot set language
        tagName: 'tagOne,tagTwo,tagThree',
        force: true,
      });
      assert.equal(tagIds.length, 3);

      // ok
      this.ctx.success();
    }

  }

  return TagController;

};
