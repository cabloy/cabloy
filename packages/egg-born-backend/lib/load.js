/*
* @Author: zhennann
* @Date:   2017-09-15 21:40:49
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-19 12:06:37
*/


const AppWorkerLoader = require('egg').AppWorkerLoader;
const loadModules = require('./module');

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
    loadModules(this);

  }

}

exports.AppWorkerLoader = CustomAppWorkerLoader;
