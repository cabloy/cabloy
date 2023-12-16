const functions = require('./resource/functions.js');
const menus = require('./resource/menus.js');
const mines = require('./resource/mines.js');
const widgets = require('./resource/widgets.js');
const blocks = require('./resource/blocks.js');
const deprecateds = require('./resource/deprecateds.js');


  let resources = [];
  resources = resources.concat(functions );
  resources = resources.concat(menus );
  resources = resources.concat(mines );
  resources = resources.concat(widgets );
  resources = resources.concat(blocks );
  resources = resources.concat(deprecateds );
   module.exports = resources;
