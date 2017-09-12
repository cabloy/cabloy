/*
* @Author: zhennann
* @Date:   2017-09-8 21:31:56
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-12 21:23:43
*/

import Vue from 'vue';

import extend from 'extend2';

import main from '../../../src/main.js';

Vue.use(main, ops => {

  if (ops.mode === 'framework7') {
    const options = require('./inject/framework7.js').default(Vue);

    const optionsNew = {};
    extend(true, optionsNew, ops.options);
    extend(true, optionsNew, options);

    if (ops.options.methods && ops.options.methods.onF7Init) {
      optionsNew.methods.__onF7Init = ops.options.methods.onF7Init;
    }

    new Vue(optionsNew);
  } else if (ops.mode === 'vuerouter') {
    require('./inject/vuerouter.js').default(Vue, ops.options.router);
    new Vue(ops.options);
  } else {
    console.warning('should be framework7 or vuerouter!');
  }

});

