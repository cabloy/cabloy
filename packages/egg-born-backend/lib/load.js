/*
* @Author: zhennann
* @Date:   2017-09-15 21:40:49
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-18 11:42:10
*/


const AppWorkerLoader = require('egg').AppWorkerLoader;
const loadModule = require('./module.js');

class CustomAppWorkerLoader extends AppWorkerLoader {
  constructor(opt) {
    super(opt);
  }
  loadConfig() {
    super.loadConfig();
  }
  load() {
    super.load();

    // load modules
    loadModule(this);

  }

}

exports.AppWorkerLoader = CustomAppWorkerLoader;
