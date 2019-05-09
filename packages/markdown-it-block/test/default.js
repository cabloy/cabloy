'use strict';


var path     = require('path');
var generate = require('markdown-it-testgen');

/*eslint-env mocha*/

var options = {
  blocks:{
    iframe:{
      render:function ({ md, token, content, block }){
        var src = md.utils.escapeHtml(content.src);
        return `<div><iframe src="${src}"></iframe></div>\n`;
      }
    }
  }
};

describe('default block', function () {
  var md = require('markdown-it')()
              .use(require('../'), options);

  generate(path.join(__dirname, 'fixtures/default.txt'), md);
});
