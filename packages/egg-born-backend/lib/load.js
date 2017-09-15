/*
* @Author: zhennann
* @Date:   2017-09-15 21:40:49
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-15 23:21:00
*/

const AppWorkerLoader = require('egg').AppWorkerLoader;

class CustomAppWorkerLoader extends AppWorkerLoader {
  constructor(opt) {
    super(opt);
  }
  loadConfig() {
    super.loadConfig();
  }
  load() {
    super.load();
  }
}

exports.AppWorkerLoader = CustomAppWorkerLoader;

