/*
* @Author: zhennann
* @Date:   2017-09-8 21:31:56
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-11 00:02:20
*/

import Vue from 'vue';

// eslint-disable-next-line
import Framework7 from 'framework7';
import Framework7Vue from 'framework7-vue/dist/framework7-vue.js';

import extend from 'extend2';
import main from '../../../src/main.js';

const options = require('./options.js').default(Vue);

Vue.use(Framework7Vue);
Vue.use(main);

const ops = main.initialize();
extend(true, options, ops);

// Init App
new Vue(options);
